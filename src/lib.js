/**
 * Pure helpers: time zones, countdown, plurals, RSVP validation and sending.
 * No DOM access, so it can be tested in Node (see tests/).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WeddingLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /** Offset (ms) of a time zone from UTC at the given instant. */
  function tzOffsetMs(utcMs, timeZone) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    var p = {};
    dtf.formatToParts(new Date(utcMs)).forEach(function (x) { p[x.type] = x.value; });
    var asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    return asUtc - Math.floor(utcMs / 1000) * 1000;
  }

  function parseLocal(str) {
    var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(str));
    if (!m) throw new Error('Expected YYYY-MM-DDTHH:MM, got: ' + str);
    return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
  }

  /** "2027-06-19T16:00" in an IANA zone  ->  UTC milliseconds. */
  function zonedToUtc(localStr, timeZone) {
    var wall = parseLocal(localStr);
    var guess = wall - tzOffsetMs(wall, timeZone);
    var off = tzOffsetMs(guess, timeZone);
    var result = wall - off;
    // second pass settles dates next to a daylight-saving change
    return wall - tzOffsetMs(result, timeZone);
  }

  /** Time left until targetMs. */
  function countdown(targetMs, nowMs) {
    var diff = targetMs - nowMs;
    if (diff <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    var s = Math.floor(diff / 1000);
    return {
      done: false,
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
  }

  /** Pick the right word form for n in a language. */
  function plural(lang, n, forms) {
    var cat = 'other';
    try { cat = new Intl.PluralRules(lang).select(n); } catch (e) { /* keep other */ }
    return forms[cat] || forms.other || '';
  }

  /** "16:00" -> "16:00" or "4:00 PM" depending on the language. */
  function formatWallTime(hhmm, locale) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
    if (!m) return hhmm;
    return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2000, 0, 1, +m[1], +m[2])));
  }

  /** True once the last day of the deadline (venue time) is over. */
  function isPastDeadline(deadline, timeZone, nowMs) {
    if (!deadline) return false;
    return zonedToUtc(deadline + 'T23:59:59', timeZone) < nowMs;
  }

  /** Returns { field: 'code' } for every problem; {} means valid. */
  function validateRsvp(v, cfg) {
    var e = {};
    var name = String(v.fullName || '').trim();
    if (!name) e.fullName = 'required';
    else if (name.length < 2) e.fullName = 'short';
    else if (name.length > 120) e.fullName = 'long';

    if (v.attendance !== 'yes' && v.attendance !== 'no') e.attendance = 'required';

    if (v.attendance === 'yes') {
      var max = (cfg && cfg.maxGuests) || 1;
      var raw = v.guests;
      var n = Number(raw);
      if (raw === '' || raw == null) e.guests = 'required';
      else if (!Number.isInteger(n) || n < 1 || n > max) e.guests = 'range';
    }
    if (String(v.dietary || '').length > 300) e.dietary = 'long';
    if (String(v.message || '').length > 1000) e.message = 'long';
    return e;
  }

  function buildPayload(v, lang) {
    var attending = v.attendance === 'yes';
    return {
      fullName: String(v.fullName).trim(),
      attendance: v.attendance,
      guests: attending ? Number(v.guests) : 0,
      dietary: String(v.dietary || '').trim(),
      message: String(v.message || '').trim(),
      language: lang || '',
      submittedAt: new Date().toISOString(),
    };
  }

  /**
   * Sends a reply. Never reports success unless the server answered 2xx.
   * Returns { status: 'ok' | 'not-configured' | 'error', code? }.
   */
  async function submitRsvp(values, rsvpCfg, fetchImpl, timeoutMs, lang) {
    if (values.website && String(values.website).trim()) return { status: 'ok', spam: true };
    if (!rsvpCfg || !rsvpCfg.endpoint) return { status: 'not-configured' };
    var payload = buildPayload(values, lang);
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 15000) : null;
    try {
      var init = { method: 'POST', signal: ctrl ? ctrl.signal : undefined };
      if (rsvpCfg.format === 'form') {
        init.headers = { Accept: 'application/json' };
        init.body = new URLSearchParams(Object.keys(payload).reduce(function (o, k) { o[k] = String(payload[k]); return o; }, {})).toString();
        init.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        init.headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        init.body = JSON.stringify(payload);
      }
      var res = await fetchImpl(rsvpCfg.endpoint, init);
      if (res && res.ok) return { status: 'ok' };
      return { status: 'error', code: 'http', httpStatus: res && res.status };
    } catch (err) {
      return { status: 'error', code: err && err.name === 'AbortError' ? 'timeout' : 'network' };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function directionsUrls(venue) {
    var q = venue.mapQuery || (venue.addressLines || []).join(', ');
    var enc = encodeURIComponent(q);
    return {
      google: 'https://www.google.com/maps/dir/?api=1&destination=' + enc,
      apple: 'https://maps.apple.com/?daddr=' + enc,
      twogis: venue.twoGisUrl || '',
      query: q,
    };
  }

  return {
    tzOffsetMs: tzOffsetMs, zonedToUtc: zonedToUtc, countdown: countdown, plural: plural,
    formatWallTime: formatWallTime, isPastDeadline: isPastDeadline,
    validateRsvp: validateRsvp, buildPayload: buildPayload, submitRsvp: submitRsvp,
    directionsUrls: directionsUrls,
  };
});
