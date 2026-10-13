/**
 * Renders the invitation from config.js (facts) and strings.js (interface text).
 * No dependencies. Sections are plain functions that return HTML.
 */
(function () {
  'use strict';

  var C = window.WEDDING_CONFIG;
  var S = window.WEDDING_STRINGS;
  var Lib = window.WeddingLib;

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var KEY_LANG = 'wedding-lang';
  var KEY_RSVP = 'wedding-rsvp';

  /* ------------------------------------------------------------ storage */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) { /* private mode */ } }

  /* -------------------------------------------------------------- state */
  function pickLang() {
    var av = C.languages.available;
    var saved = lsGet(KEY_LANG);
    if (saved && av.indexOf(saved) > -1) return saved;
    if (C.languages.detect) {
      var nav = String((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
      if (av.indexOf(nav) > -1) return nav;
    }
    return C.languages.default;
  }

  var state = {
    lang: pickLang(),
    first: true,
    rsvp: { values: { fullName: '', attendance: '', guests: '1', dietary: '', message: '', website: '' }, errors: {}, status: 'idle', failure: '', name: '', attendance: '', already: false },
  };

  (function restoreReply() {
    var raw = lsGet(KEY_RSVP);
    if (!raw) return;
    try {
      var r = JSON.parse(raw);
      if (r && r.name) { state.rsvp.status = 'success'; state.rsvp.name = r.name; state.rsvp.attendance = r.attendance; state.rsvp.already = true; }
    } catch (e) { lsDel(KEY_RSVP); }
  })();

  var eventMs = Lib.zonedToUtc(C.event.start, C.event.timeZone);

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function plain(s) { return String(s).replace(/\*/g, ''); }
  function T() { return S[state.lang] || S[C.languages.default]; }
  function fill(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function tx(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (v[state.lang] != null) return v[state.lang];
    if (v[C.languages.default] != null) return v[C.languages.default];
    var k = Object.keys(v)[0];
    return k ? v[k] : '';
  }
  function img(key) { return C.images[key] || ''; }

  function evFmt(opts) { return new Intl.DateTimeFormat(T().locale, Object.assign({ timeZone: C.event.timeZone }, opts)); }
  function longDate() { return evFmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(eventMs); }
  function fullDate() { return evFmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(eventMs); }
  function startTime() { return evFmt({ hour: 'numeric', minute: '2-digit' }).format(eventMs); }
  function zoneName() {
    var p = evFmt({ timeZoneName: 'long' }).formatToParts(eventMs).filter(function (x) { return x.type === 'timeZoneName'; })[0];
    return p ? p.value : C.event.timeZone;
  }
  function isoDate() { return evFmt({ year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(eventMs).reduce(function (o, p) { o[p.type] = p.value; return o; }, {}); }
  function names() { return { first: tx(C.couple.first), second: tx(C.couple.second) }; }

  var ICONS = {
    arrival: '<path d="M6 21V10a6 6 0 0 1 12 0v11M3 21h18"/>',
    rings: '<circle cx="9" cy="14.5" r="5"/><circle cx="15" cy="14.5" r="5"/><path d="M12 3.5l1.3 2L12 7.5l-1.3-2z"/>',
    glass: '<path d="M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M9 20h6"/>',
    camera: '<rect x="3" y="7" width="18" height="13"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-3h3L15 7"/>',
    dinner: '<circle cx="12" cy="12" r="5"/><path d="M3 4v6a2 2 0 0 0 2 2v8M21 4c-2 1-3 4-3 8h3v8"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="16" r="2"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.heart) + '</svg>';
  }

  /* ----------------------------------------------------------- sections */
  function header() {
    var t = T(), n = names();
    var initials = Array.from(n.first)[0] + '&amp;' + Array.from(n.second)[0];
    var langs = '';
    if (C.languages.available.length > 1) {
      langs = '<div class="lang" role="group" aria-label="' + esc(t.nav.language) + '">' +
        C.languages.available.map(function (code) {
          var label = (S[code] && S[code].label) || code;
          return '<button type="button" data-lang="' + esc(code) + '" lang="' + esc(code) + '" aria-pressed="' + (code === state.lang) + '" title="' + esc(label) + '">' + esc(code.toUpperCase()) + '</button>';
        }).join('') + '</div>';
    }
    var rsvp = C.sections.rsvp ? '<a class="bar-rsvp" href="#rsvp">' + esc(t.nav.rsvp) + '</a>' : '';
    return '<header class="bar" id="bar"><a class="bar-mark" href="#top" aria-label="' + esc(t.nav.home) + '">' + initials + '</a><div class="bar-end">' + langs + rsvp + '</div></header>';
  }

  function hero() {
    var t = T(), n = names();
    return '<section class="hero" id="top" style="--focal:' + esc(C.heroFocal || '50% 50%') + '">' +
      '<div class="hero-media" aria-hidden="true"><img src="' + esc(img('hero')) + '" alt="" data-par="0.28" fetchpriority="high" decoding="async"></div>' +
      '<div class="hero-shade"></div>' +
      '<div class="wrap hero-body">' +
        '<p class="hero-line">' + esc(tx(C.hero.line)) + '</p>' +
        '<h1 class="hero-names"><span class="nm"><span>' + esc(n.first) + '</span></span><span class="amp" aria-hidden="true">&amp;</span><span class="sr-only"> &amp; </span><span class="nm"><span>' + esc(n.second) + '</span></span></h1>' +
        '<p class="hero-meta"><time datetime="' + esc(C.event.start) + '">' + esc(longDate()) + '</time><span class="rule" aria-hidden="true"></span><span>' + esc(tx(C.event.placeLabel)) + '</span></p>' +
      '</div>' +
      '<a class="scroll" href="#invitation" aria-label="' + esc(t.hero.scroll) + '"><i></i></a>' +
    '</section>';
  }

  function invitation() {
    var t = T(), n = names(), inv = C.invitation;
    var body = tx(inv.body);
    var paras = Array.isArray(body) ? body : [body];
    return '<section class="sec invite" id="invitation" aria-labelledby="invite-h"><div class="wrap invite-grid">' +
      '<div class="rv"><p class="kicker">' + esc(t.invitation.kicker) + '</p>' +
        '<svg class="sprig" viewBox="0 0 56 90" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M28 88C28 60 28 30 28 4"/><path d="M28 70c-10-2-16-8-18-16 10 0 17 5 18 16zM28 70c10-2 16-8 18-16-10 0-17 5-18 16zM28 48c-9-2-14-7-16-14 9 0 15 4 16 14zM28 48c9-2 14-7 16-14-9 0-15 4-16 14zM28 28c-6-2-9-6-10-11 6 0 9 4 10 11zM28 28c6-2 9-6 10-11-6 0-9 4-10 11z"/></svg></div>' +
      '<div><h2 class="invite-title rv" id="invite-h">' + rich(tx(inv.heading)) + '</h2>' +
        '<div class="invite-body rv" data-d="1">' + paras.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
        '<p class="invite-sign rv" data-d="2"><small>' + esc(tx(inv.signoff)) + '</small><strong>' + esc(n.first) + ' ' + (t.locale.indexOf('ru') === 0 ? 'и' : '&amp;') + ' ' + esc(n.second) + '</strong></p>' +
      '</div></div></section>';
  }

  function story() {
    var t = T();
    var chaps = C.story.map(function (c, i) {
      var arch = i === 0 ? ' frame--arch' : '';
      return '<article class="chap"><div class="frame' + arch + ' rv"><img src="' + esc(img(c.image)) + '" alt="" loading="lazy" decoding="async" data-par="0.08"></div>' +
        '<div class="chap-text rv" data-d="1"><p class="chap-year">' + esc(c.year) + '</p><h3>' + esc(tx(c.title)) + '</h3><p>' + esc(tx(c.text)) + '</p></div></article>';
    }).join('');
    return '<section class="sec story" id="story" aria-labelledby="story-h"><div class="wrap">' +
      '<div class="story-head rv"><p class="kicker">' + esc(t.story.kicker) + '</p><h2 class="h2" id="story-h">' + rich(t.story.title) + '</h2></div>' + chaps + '</div></section>';
  }

  function countdownSection() {
    var t = T(), cd = Lib.countdown(eventMs, Date.now());
    var units = ['days', 'hours', 'minutes', 'seconds'];
    var grid = units.map(function (u) {
      return '<div class="cd-unit"><span class="cd-num" data-unit="' + u + '">' + cdValue(u, cd[u]) + '</span><span class="cd-label" data-label="' + u + '">' + esc(Lib.plural(t.locale, cd[u], t.countdown.labels[u])) + '</span></div>';
    }).join('');
    var zone = fill(t.countdown.zone, { date: longDate(), time: startTime(), zone: zoneName() });
    return '<section class="sec band" id="countdown" aria-labelledby="cd-h"><div class="wrap">' +
      '<div class="rv"><p class="kicker">' + esc(t.countdown.kicker) + '</p><h2 class="h2" id="cd-h">' + rich(t.countdown.title) + '</h2></div>' +
      '<div id="cd-live">' + countdownBody(cd, grid) + '</div>' +
      '<p class="cd-zone">' + esc(zone) + '</p>' +
      '<p class="sr-only" id="cd-sr" aria-live="polite"></p></div></section>';
  }
  function cdValue(u, v) { return u === 'days' ? String(v) : String(v).padStart(2, '0'); }
  function countdownBody(cd, grid) {
    var t = T();
    if (cd.done) return '<div class="cd-done rv"><strong>' + esc(t.countdown.done) + '</strong><span>' + esc(t.countdown.doneSub) + '</span></div>';
    return '<div class="cd rv" role="timer" aria-label="' + esc(plain(t.countdown.title)) + '">' + grid + '</div>';
  }

  function schedule() {
    var t = T();
    var items = C.schedule.map(function (e, i) {
      return '<li class="ev rv" data-d="' + Math.min(i % 3, 3) + '"><div class="ev-time">' + esc(Lib.formatWallTime(e.time, t.locale)) + '</div>' +
        '<div class="ev-mark"><span>' + icon(e.icon) + '</span></div>' +
        '<div><h3>' + esc(tx(e.title)) + '</h3><p>' + esc(tx(e.text)) + '</p></div></li>';
    }).join('');
    return '<section class="sec" id="schedule" aria-labelledby="sched-h"><div class="wrap sched">' +
      '<div class="sched-head rv"><p class="kicker">' + esc(t.schedule.kicker) + '</p><h2 class="h2" id="sched-h">' + rich(t.schedule.title) + '</h2><p class="sched-note">' + esc(t.schedule.note) + '</p></div>' +
      '<ol class="tl">' + items + '</ol></div></section>';
  }

  function mapPreview(urls) {
    var t = T(), v = C.venue;
    var inner;
    if (v.mapEmbedUrl) {
      inner = '<iframe src="' + esc(v.mapEmbedUrl) + '" title="' + esc(tx(v.name)) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
      return '<div class="map rv">' + inner + '</div>';
    }
    inner = '<svg class="map-svg" viewBox="0 0 840 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect class="map-land" width="840" height="320"/>' +
      '<path class="map-park" d="M470 40 L690 20 L740 140 L560 180 L470 120 Z"/>' +
      '<path class="map-park" d="M60 200 L210 170 L260 300 L90 310 Z"/>' +
      '<path class="map-water" d="M-20 250 C140 210 260 300 400 250 S660 190 880 260"/>' +
      '<g><path class="map-road" d="M0 120 L840 90"/><path class="map-road" d="M300 -10 L360 330"/><path class="map-road" d="M620 -10 L560 330"/>' +
      '<path class="map-road2" d="M0 190 L840 170"/><path class="map-road2" d="M120 -10 L170 330"/><path class="map-road2" d="M450 -10 L470 330"/><path class="map-road2" d="M740 -10 L700 330"/><path class="map-road2" d="M0 40 L840 30"/></g>' +
      '<g transform="translate(420 118)"><path class="map-pin" d="M0 -48C-18 -48 -30 -35 -30 -19C-30 5 0 34 0 34S30 5 30 -19C30 -35 18 -48 0 -48Z"/><circle class="map-pin-dot" cy="-19" r="10"/></g></svg>' +
      '<div class="map-label"><span>' + esc(t.venue.mapPreview) + '</span><span>' + esc(t.venue.openMap) + '</span></div>';
    return '<a class="map rv" href="' + esc(urls.google) + '" target="_blank" rel="noopener" aria-label="' + esc(t.venue.openMap + ': ' + tx(v.name)) + '">' + inner + '</a>';
  }

  function venue() {
    var t = T(), v = C.venue, urls = Lib.directionsUrls(v);
    var addr = v.addressLines.map(esc).join('<br>');
    return '<section class="sec venue" id="venue" aria-labelledby="venue-h"><div class="wrap">' +
      '<div class="venue-grid">' +
        '<div class="venue-photo"><div class="frame rv"><img src="' + esc(img('venue')) + '" alt="" loading="lazy" decoding="async" data-par="0.08"></div></div>' +
        '<div class="venue-info rv" data-d="1"><p class="kicker">' + esc(t.venue.kicker) + '</p>' +
          '<h2 class="venue-name" id="venue-h">' + esc(tx(v.name)) + '</h2>' +
          '<dl class="facts"><div><dt>' + esc(t.venue.address) + '</dt><dd><address>' + addr + '</address></dd></div>' +
          '<div><dt>' + esc(t.venue.date) + '</dt><dd>' + esc(fullDate()) + '</dd></div>' +
          '<div><dt>' + esc(t.venue.time) + '</dt><dd>' + esc(startTime()) + '</dd></div></dl>' +
          '<div class="btns"><a class="btn" href="' + esc(urls.google) + '" target="_blank" rel="noopener">' + esc(t.venue.directions) + ' · ' + esc(t.venue.google) + '</a>' +
          '<a class="btn btn--ghost" href="' + esc(urls.apple) + '" target="_blank" rel="noopener">' + esc(t.venue.apple) + '</a></div>' +
        '</div></div>' + mapPreview(urls) + '</div></section>';
  }

  function dressCode() {
    var t = T(), d = C.dressCode;
    var chips = d.palette.map(function (c) {
      return '<li class="chip"><i style="--c:' + esc(c.hex) + '"></i><span>' + esc(tx(c.name)) + '</span></li>';
    }).join('');
    return '<section class="sec" id="dress" aria-labelledby="dress-h"><div class="wrap dress-grid">' +
      '<div class="rv"><p class="kicker">' + esc(t.dress.kicker) + '</p><h2 class="h2" id="dress-h">' + rich(t.dress.title) + '</h2>' +
        '<p class="dress-text">' + esc(tx(d.text)) + '</p><p class="dress-note">' + esc(tx(d.note)) + '</p>' +
        '<p class="chips-title">' + esc(t.dress.palette) + '</p><ul class="chips">' + chips + '</ul></div>' +
      '<div class="dress-photo"><div class="frame frame--arch rv" data-d="1"><img src="' + esc(img('dress')) + '" alt="" loading="lazy" decoding="async" data-par="0.08"></div></div>' +
    '</div></section>';
  }

  /* --- RSVP --- */
  function contactsHtml() {
    var t = T();
    if (!C.contacts || !C.contacts.length) return '';
    var rows = C.contacts.map(function (c, i) {
      var href = c.type === 'email' ? 'mailto:' + c.value : c.type === 'tel' ? 'tel:' + c.value.replace(/[^+\d]/g, '') : '';
      var val = href ? '<a href="' + esc(href) + '" id="ct-' + i + '">' + esc(c.value) + '</a>' : '<span id="ct-' + i + '">' + esc(c.value) + '</span>';
      return '<div class="contact"><b>' + esc(tx(c.label)) + '</b>' + val + '<button type="button" class="copy" data-copy="ct-' + i + '">' + esc(t.rsvp.copy) + '</button></div>';
    }).join('');
    return '<div class="contacts"><h3>' + esc(t.rsvp.contact) + '</h3>' + rows + '</div>';
  }

  function fieldError(code, key) {
    var t = T().rsvp;
    if (!code) return '';
    var msg = key === 'attendance' ? t.errors.attendance : key === 'guests' ? t.errors.guests : (t.errors[code] || t.errors.required);
    return '<p class="err" id="err-' + key + '">' + esc(msg) + '</p>';
  }

  function rsvpForm() {
    var t = T().rsvp, r = state.rsvp, v = r.values, e = r.errors, f = t.fields;
    var max = C.rsvp.maxGuests || 1, opts = '';
    for (var i = 1; i <= max; i++) opts += '<option value="' + i + '"' + (String(v.guests) === String(i) ? ' selected' : '') + '>' + i + '</option>';
    var busy = r.status === 'submitting';
    var errKeys = Object.keys(e);
    var banner = !C.rsvp.endpoint ? '<p class="note" id="rsvp-banner">' + esc(t.previewBanner) + '</p>' : '';
    var summary = errKeys.length ? '<p class="note note--err" id="rsvp-summary" role="alert" tabindex="-1">' + esc(t.summary) + '</p>' : '';
    var failure = r.failure ? '<p class="note note--err" id="rsvp-failure" role="alert" tabindex="-1">' + esc(r.failure) + '</p>' : '';
    var inv = function (k) { return e[k] ? ' aria-invalid="true" aria-describedby="err-' + k + '"' : ''; };

    return '<form class="form" id="rsvp-form" novalidate aria-labelledby="rsvp-h">' + banner + summary + failure +
      '<div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" value="' + esc(v.website) + '"></label></div>' +
      '<div class="field"><label for="f-name">' + esc(f.name) + '</label>' +
        '<input class="input" id="f-name" name="fullName" type="text" autocomplete="name" required aria-required="true" placeholder="' + esc(f.namePh) + '" value="' + esc(v.fullName) + '"' + inv('fullName') + '>' + fieldError(e.fullName, 'fullName') + '</div>' +
      '<fieldset class="field"' + (e.attendance ? ' data-invalid="true"' : '') + '><legend>' + esc(f.attendance) + '</legend>' +
        '<div class="choices"><label class="choice"><input type="radio" name="attendance" value="yes"' + (v.attendance === 'yes' ? ' checked' : '') + (e.attendance ? ' aria-describedby="err-attendance"' : '') + '><span>' + esc(f.yes) + '</span></label>' +
        '<label class="choice"><input type="radio" name="attendance" value="no"' + (v.attendance === 'no' ? ' checked' : '') + '><span>' + esc(f.no) + '</span></label></div>' + fieldError(e.attendance, 'attendance') + '</fieldset>' +
      '<div class="field" id="guests-field"' + (v.attendance === 'yes' ? '' : ' hidden') + '><label for="f-guests">' + esc(f.guests) + '</label>' +
        '<select class="input" id="f-guests" name="guests"' + inv('guests') + '>' + opts + '</select>' + fieldError(e.guests, 'guests') + '</div>' +
      (C.rsvp.dietary ? '<div class="field"><label for="f-diet">' + esc(f.dietary) + ' <span class="opt">(' + esc(f.optional) + ')</span></label>' +
        '<input class="input" id="f-diet" name="dietary" type="text" placeholder="' + esc(f.dietaryPh) + '" value="' + esc(v.dietary) + '"' + inv('dietary') + '>' + fieldError(e.dietary, 'dietary') + '</div>' : '') +
      (C.rsvp.message ? '<div class="field"><label for="f-msg">' + esc(f.message) + ' <span class="opt">(' + esc(f.optional) + ')</span></label>' +
        '<textarea class="input" id="f-msg" name="message" rows="4" placeholder="' + esc(f.messagePh) + '"' + inv('message') + '>' + esc(v.message) + '</textarea>' + fieldError(e.message, 'message') + '</div>' : '') +
      '<div class="form-actions"><button class="btn" type="submit"' + (busy ? ' disabled aria-busy="true"' : '') + '>' + esc(busy ? t.sending : t.submit) + '</button></div>' +
    '</form>';
  }

  function rsvpSuccess() {
    var t = T().rsvp, r = state.rsvp;
    var msg = r.attendance === 'no' ? t.success.no : t.success.yes;
    return '<div class="success" id="rsvp-success" role="status" tabindex="-1">' +
      '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M14 25l7 7 13-15"/></svg>' +
      '<h3>' + esc(fill(t.success.title, { name: r.name })) + '</h3><p>' + esc(msg) + '</p>' +
      (r.already ? '<p class="rsvp-lead">' + esc(t.success.already) + '</p>' : '') +
      '<button type="button" class="btn btn--ghost" id="rsvp-again">' + esc(t.success.again) + '</button></div>';
  }

  function rsvpInner() {
    var t = T().rsvp, r = state.rsvp;
    var closed = Lib.isPastDeadline(C.rsvp.deadline, C.event.timeZone, Date.now());
    var deadline = C.rsvp.deadline ? fill(t.deadline, { date: new Intl.DateTimeFormat(T().locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: C.event.timeZone }).format(Lib.zonedToUtc(C.rsvp.deadline + 'T12:00', C.event.timeZone)) }) : '';
    var main = r.status === 'success' ? rsvpSuccess() : closed ? '<p class="note">' + esc(t.closed) + '</p>' : rsvpForm();
    return '<div class="wrap rsvp-grid">' +
      '<div class="rsvp-intro rv"><p class="kicker">' + esc(t.kicker) + '</p><h2 class="h2" id="rsvp-h">' + rich(t.title) + '</h2>' +
      '<p class="rsvp-lead">' + esc(deadline) + '</p>' + contactsHtml() + '</div>' +
      '<div class="rv" data-d="1" aria-live="polite">' + main + '</div></div>';
  }
  function rsvpSection() { return '<section class="sec rsvp" id="rsvp">' + rsvpInner() + '</section>'; }

  function closing() {
    var t = T(), n = names(), amp = t.locale.indexOf('ru') === 0 ? 'и' : '&amp;';
    return '<section class="closing" id="closing" aria-label="' + esc(t.closing.kicker) + '">' +
      '<div class="closing-media" aria-hidden="true"><img src="' + esc(img('closing')) + '" alt="" loading="lazy" decoding="async" data-par="0.1"></div>' +
      '<div class="wrap closing-in rv">' +
        '<svg class="rings" viewBox="0 0 120 64" aria-hidden="true"><circle cx="44" cy="32" r="26" pathLength="1"/><circle cx="76" cy="32" r="26" pathLength="1"/></svg>' +
        '<p class="kicker">' + esc(t.closing.kicker) + '</p>' +
        '<p class="closing-msg">' + esc(tx(C.closing.message)) + '</p>' +
        '<p class="closing-names h1like">' + esc(n.first) + ' <em>' + amp + '</em> ' + esc(n.second) + '</p>' +
        '<p class="closing-date">' + esc(longDate()) + '</p>' +
        (C.couple.hashtag ? '<p class="closing-tag">' + esc(C.couple.hashtag) + '</p>' : '') +
        '<a class="top" href="#top">' + esc(t.nav.home) + '</a>' +
      '</div></section>';
  }

  /* ------------------------------------------------------------- render */
  var root;
  function render() {
    var t = T();
    document.documentElement.lang = state.lang;
    var n = names(), vars = { first: n.first, second: n.second, date: longDate() };
    document.title = fill(t.meta.title, vars);
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', fill(t.meta.description, vars));
    var ogt = $('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', fill(t.meta.title, vars));
    var ogd = $('meta[property="og:description"]'); if (ogd) ogd.setAttribute('content', fill(t.meta.description, vars));

    root.className = state.first ? '' : 'no-intro';
    root.innerHTML = '<a class="skip" href="#main">' + esc(t.nav.skip) + '</a>' + header() +
      '<main id="main">' + hero() + invitation() +
      (C.sections.story && C.story.length ? story() : '') +
      (C.sections.countdown ? countdownSection() : '') +
      (C.sections.schedule && C.schedule.length ? schedule() : '') +
      (C.sections.venue ? venue() : '') +
      (C.sections.dressCode ? dressCode() : '') +
      (C.sections.rsvp ? rsvpSection() : '') +
      closing() + '</main>';
    state.first = false;
    afterRender();
  }

  function refreshRsvp(focusSel) {
    var sec = $('#rsvp');
    if (!sec) return;
    sec.innerHTML = rsvpInner();
    $$('.rv', sec).forEach(function (el) { el.classList.add('in'); });
    if (focusSel) { var el = $(focusSel); if (el) el.focus({ preventScroll: false }); }
  }

  /* --------------------------------------------------- effects & timers */
  var io = null, tick = null;
  function afterRender() {
    setupReveal();
    startCountdown();
    onScroll();
  }

  function setupReveal() {
    var els = $$('.rv');
    if (io) io.disconnect();
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var firstPaint = root.className.indexOf('no-intro') > -1;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { if (firstPaint) e.classList.add('in'); else io.observe(e); });
    var closingEl = $('#closing');
    if (closingEl) {
      var co = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { closingEl.classList.add('in'); co.disconnect(); } }, { threshold: 0.3 });
      co.observe(closingEl);
      if (reduceMotion) closingEl.classList.add('in');
    }
  }

  function startCountdown() {
    if (tick) clearInterval(tick);
    var sec = $('#countdown');
    if (!sec) return;
    var lastMinute = -1;
    function update() {
      var t = T(), cd = Lib.countdown(eventMs, Date.now());
      if (cd.done) {
        var live = $('#cd-live');
        if (live && !$('.cd-done', live)) live.innerHTML = countdownBody(cd, '');
        $$('.cd-done', live).forEach(function (el) { el.classList.add('in'); });
        clearInterval(tick);
        return;
      }
      ['days', 'hours', 'minutes', 'seconds'].forEach(function (u) {
        var num = $('[data-unit="' + u + '"]', sec), lab = $('[data-label="' + u + '"]', sec);
        if (!num) return;
        var v = cdValue(u, cd[u]);
        if (num.textContent !== v) num.textContent = v;
        var l = Lib.plural(t.locale, cd[u], t.countdown.labels[u]);
        if (lab && lab.textContent !== l) lab.textContent = l;
      });
      if (cd.minutes !== lastMinute) {
        lastMinute = cd.minutes;
        var sr = $('#cd-sr');
        if (sr) sr.textContent = cd.days + ' ' + Lib.plural(t.locale, cd.days, t.countdown.labels.days) + ', ' + cd.hours + ' ' + Lib.plural(t.locale, cd.hours, t.countdown.labels.hours) + ', ' + cd.minutes + ' ' + Lib.plural(t.locale, cd.minutes, t.countdown.labels.minutes);
      }
    }
    update();
    tick = setInterval(update, 1000);
  }

  var rafId = 0;
  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = 0;
      var bar = $('#bar');
      if (bar) bar.classList.toggle('is-solid', window.scrollY > 60);
      if (reduceMotion) return;
      var vh = window.innerHeight;
      $$('[data-par]').forEach(function (el) {
        var box = el.parentElement.getBoundingClientRect();
        if (box.bottom < -100 || box.top > vh + 100) return;
        var speed = parseFloat(el.getAttribute('data-par')) || 0.08;
        var mid = box.top + box.height / 2 - vh / 2;
        var extra = box.height * (el.closest('.hero-media') ? 0.11 : 0.09);
        var y = Math.max(-extra, Math.min(extra, -mid * speed));
        el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      });
    });
  }

  /* ------------------------------------------------------------- events */
  function readForm(form) {
    var v = state.rsvp.values, fd = new FormData(form);
    ['fullName', 'attendance', 'guests', 'dietary', 'message', 'website'].forEach(function (k) {
      var val = fd.get(k);
      if (val != null) v[k] = String(val);
      else if (k === 'attendance') v[k] = '';
    });
  }

  function onInput(e) {
    var form = e.target.closest && e.target.closest('#rsvp-form');
    if (!form) return;
    var el = e.target;
    if (el.name && el.name in state.rsvp.values) state.rsvp.values[el.name] = el.value;
    if (el.name === 'attendance') {
      var g = $('#guests-field'); if (g) g.hidden = el.value !== 'yes';
    }
    if (el.getAttribute('aria-invalid') === 'true') {
      el.removeAttribute('aria-invalid');
      var er = $('#err-' + el.name); if (er) er.remove();
    }
  }

  async function onSubmit(e) {
    if (!e.target.closest || !e.target.closest('#rsvp-form')) return;
    e.preventDefault();
    var r = state.rsvp;
    if (r.status === 'submitting' || r.status === 'success') return; // blocks duplicate sends
    readForm(e.target);
    r.errors = Lib.validateRsvp(r.values, C.rsvp);
    r.failure = '';
    var keys = Object.keys(r.errors);
    if (keys.length) {
      refreshRsvp('#rsvp-summary');
      var first = { fullName: '#f-name', attendance: 'input[name="attendance"]', guests: '#f-guests', dietary: '#f-diet', message: '#f-msg' }[keys[0]];
      var target = first && $(first); if (target) target.focus();
      return;
    }
    r.status = 'submitting';
    refreshRsvp();
    var res = await Lib.submitRsvp(r.values, C.rsvp, window.fetch ? window.fetch.bind(window) : null, 15000, state.lang);
    var t = T().rsvp;
    if (res.status === 'ok') {
      r.status = 'success'; r.name = r.values.fullName.trim(); r.attendance = r.values.attendance; r.already = false;
      lsSet(KEY_RSVP, JSON.stringify({ name: r.name, attendance: r.attendance, at: Date.now() }));
      refreshRsvp('#rsvp-success');
    } else {
      r.status = 'idle';
      r.failure = res.status === 'not-configured' ? t.failure.unconfigured : (t.failure[res.code] || t.failure.network);
      refreshRsvp('#rsvp-failure');
    }
  }

  function copyText(btn) {
    var src = document.getElementById(btn.getAttribute('data-copy'));
    if (!src) return;
    var text = src.textContent, t = T().rsvp, done = function () {
      var old = btn.textContent; btn.textContent = t.copied;
      setTimeout(function () { btn.textContent = old; }, 1600);
    };
    var fallback = function () {
      var range = document.createRange(); range.selectNodeContents(src);
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (err) { fallback(); }
  }

  function onClick(e) {
    var tgt = e.target;
    var lang = tgt.closest && tgt.closest('[data-lang]');
    if (lang) {
      state.lang = lang.getAttribute('data-lang'); lsSet(KEY_LANG, state.lang);
      var y = window.scrollY; render(); window.scrollTo(0, y); return;
    }
    var cp = tgt.closest && tgt.closest('[data-copy]');
    if (cp) { copyText(cp); return; }
    if (tgt.closest && tgt.closest('#rsvp-again')) {
      var r = state.rsvp; lsDel(KEY_RSVP);
      r.status = 'idle'; r.already = false; r.errors = {}; r.failure = '';
      r.values = { fullName: '', attendance: '', guests: '1', dietary: '', message: '', website: '' };
      refreshRsvp('#f-name');
    }
  }

  /* --------------------------------------------------------------- init */
  function init() {
    root = document.getElementById('app');
    if (!root) return;
    render();
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
