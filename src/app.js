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
  var ORN = '<svg class="orn" viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M47.0 23.1 L44.3 20.8 L41.2 19.3 L37.9 18.4 L34.5 18.3 L31.3 18.8 L28.3 20.0 L25.7 21.7 L23.6 23.9 L22.0 26.5 L21.0 29.3 L20.6 32.1 L20.8 34.9 L21.6 37.6 L22.8 39.9 L24.6 41.9 L26.6 43.5 L28.9 44.5 L31.2 45.1 L33.6 45.1 L35.9 44.6 L37.9 43.7 L39.7 42.4 L41.1 40.8 L42.1 39.0 L42.7 37.1 L42.8 35.2 L42.6 33.4 L42.0 31.7 L41.0 30.3 L39.9 29.1 L38.5 28.2 L37.1 27.7 L35.6 27.5 L34.2 27.6 L32.9 28.0 L31.8 28.6 L30.9 29.5 L30.3 30.4 L29.9 31.4 L29.7 32.4 L29.8 33.4 L30.1 34.3 L30.5 35.0 L31.1 35.5 L31.7 35.9 L32.4 36.1 L33.0 36.1 L33.5 36.0"/><path d="M73.0 23.1 L75.7 20.8 L78.8 19.3 L82.1 18.4 L85.5 18.3 L88.7 18.8 L91.7 20.0 L94.3 21.7 L96.4 23.9 L98.0 26.5 L99.0 29.3 L99.4 32.1 L99.2 34.9 L98.4 37.6 L97.2 39.9 L95.4 41.9 L93.4 43.5 L91.1 44.5 L88.8 45.1 L86.4 45.1 L84.1 44.6 L82.1 43.7 L80.3 42.4 L78.9 40.8 L77.9 39.0 L77.3 37.1 L77.2 35.2 L77.4 33.4 L78.0 31.7 L79.0 30.3 L80.1 29.1 L81.5 28.2 L82.9 27.7 L84.4 27.5 L85.8 27.6 L87.1 28.0 L88.2 28.6 L89.1 29.5 L89.7 30.4 L90.1 31.4 L90.3 32.4 L90.2 33.4 L89.9 34.3 L89.5 35.0 L88.9 35.5 L88.3 35.9 L87.6 36.1 L87.0 36.1 L86.5 36.0"/><path d="M47.0 23.1 C61.0 9.1 59.0 9.1 73.0 23.1"/></svg>';
  var EAR = '<svg class="earring" viewBox="0 0 60 84" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="30" cy="6" r="3.6" pathLength="1"/><path d="M30 9.6V17" pathLength="1"/><path d="M43.8 30.0 L43.6 30.5 L43.2 31.0 L42.6 31.5 L41.9 31.9 L41.4 32.3 L41.0 32.6 L40.8 33.0 L40.9 33.5 L41.2 34.1 L41.5 34.8 L41.9 35.5 L42.1 36.2 L42.0 36.7 L41.7 37.2 L41.2 37.5 L40.4 37.6 L39.7 37.6 L38.9 37.6 L38.3 37.7 L37.9 37.9 L37.7 38.3 L37.6 38.9 L37.6 39.7 L37.6 40.4 L37.5 41.2 L37.2 41.7 L36.7 42.0 L36.2 42.1 L35.5 41.9 L34.8 41.5 L34.1 41.2 L33.5 40.9 L33.0 40.8 L32.6 41.0 L32.3 41.4 L31.9 41.9 L31.5 42.6 L31.0 43.2 L30.5 43.6 L30.0 43.8 L29.5 43.6 L29.0 43.2 L28.5 42.6 L28.1 41.9 L27.7 41.4 L27.4 41.0 L27.0 40.8 L26.5 40.9 L25.9 41.2 L25.2 41.5 L24.5 41.9 L23.8 42.1 L23.3 42.0 L22.8 41.7 L22.5 41.2 L22.4 40.4 L22.4 39.7 L22.4 38.9 L22.3 38.3 L22.1 37.9 L21.7 37.7 L21.1 37.6 L20.3 37.6 L19.6 37.6 L18.8 37.5 L18.3 37.2 L18.0 36.7 L17.9 36.2 L18.1 35.5 L18.5 34.8 L18.8 34.1 L19.1 33.5 L19.2 33.0 L19.0 32.6 L18.6 32.3 L18.1 31.9 L17.4 31.5 L16.8 31.0 L16.4 30.5 L16.2 30.0 L16.4 29.5 L16.8 29.0 L17.4 28.5 L18.1 28.1 L18.6 27.7 L19.0 27.4 L19.2 27.0 L19.1 26.5 L18.8 25.9 L18.5 25.2 L18.1 24.5 L17.9 23.8 L18.0 23.3 L18.3 22.8 L18.8 22.5 L19.6 22.4 L20.3 22.4 L21.1 22.4 L21.7 22.3 L22.1 22.1 L22.3 21.7 L22.4 21.1 L22.4 20.3 L22.4 19.6 L22.5 18.8 L22.8 18.3 L23.3 18.0 L23.8 17.9 L24.5 18.1 L25.2 18.5 L25.9 18.8 L26.5 19.1 L27.0 19.2 L27.4 19.0 L27.7 18.6 L28.1 18.1 L28.5 17.4 L29.0 16.8 L29.5 16.4 L30.0 16.2 L30.5 16.4 L31.0 16.8 L31.5 17.4 L31.9 18.1 L32.3 18.6 L32.6 19.0 L33.0 19.2 L33.5 19.1 L34.1 18.8 L34.8 18.5 L35.5 18.1 L36.2 17.9 L36.7 18.0 L37.2 18.3 L37.5 18.8 L37.6 19.6 L37.6 20.3 L37.6 21.1 L37.7 21.7 L37.9 22.1 L38.3 22.3 L38.9 22.4 L39.7 22.4 L40.4 22.4 L41.2 22.5 L41.7 22.8 L42.0 23.3 L42.1 23.8 L41.9 24.5 L41.5 25.2 L41.2 25.9 L40.9 26.5 L40.8 27.0 L41.0 27.4 L41.4 27.7 L41.9 28.1 L42.6 28.5 L43.2 29.0 L43.6 29.5 L43.8 30.0 Z" pathLength="1"/><circle cx="30" cy="30" r="7" pathLength="1"/><circle cx="30" cy="30" r="1.6" pathLength="1"/><path d="M24 41Q16 47 14 58M30 42V58M36 41Q44 47 46 58" pathLength="1"/><path d="M14 58 C18.2 62.5 18.4 68 14 70.2 C9.6 68 9.8 62.5 14 58 Z" pathLength="1"/><path d="M30 60 C34.2 64.5 34.4 70 30 72.2 C25.6 70 25.8 64.5 30 60 Z" pathLength="1"/><path d="M46 58 C50.2 62.5 50.4 68 46 70.2 C41.6 68 41.8 62.5 46 58 Z" pathLength="1"/></svg>';
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
  // Day, month and year of an instant in the venue's time zone.
  function ymd(ms) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: C.event.timeZone, year: 'numeric', month: 'numeric', day: 'numeric' })
      .formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = +x.value; });
    return p;
  }
  // A language may ship its own month and weekday names (strings.js: months, weekdays,
  // dateFormat), so dates look right even on browsers without that language's data.
  function dateText(ms) {
    var t = T();
    if (t.months && t.dateFormat) {
      var p = ymd(ms);
      return fill(t.dateFormat, { d: p.day, month: t.months[p.month - 1], y: p.year });
    }
    return evFmt({ day: 'numeric', month: 'long', year: 'numeric' }).format(ms);
  }
  function weekdayText(ms) {
    var t = T();
    if (t.weekdays) { var p = ymd(ms); return t.weekdays[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()]; }
    return evFmt({ weekday: 'long' }).format(ms);
  }
  function longDate() { return dateText(eventMs); }
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
          return '<button type="button" data-lang="' + esc(code) + '" lang="' + esc(code) + '" aria-pressed="' + (code === state.lang) + '" title="' + esc(label) + '">' + esc((S[code] && S[code].short) || code.toUpperCase()) + '</button>';
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
        ORN + '</div>' +
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

  function venue() {
    var t = T(), v = C.venue, urls = Lib.directionsUrls(v);
    var main = urls.twogis || urls.google;
    var addrText = v.address ? tx(v.address) : (v.addressLines || []).join(', ');
    var day = evFmt({ day: 'numeric' }).format(eventMs);
    var weekday = weekdayText(eventMs);
    var sub = weekday + ', ' + fill(t.venue.startsAt, { time: startTime() });
    var pin = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
    var more = urls.twogis
      ? '<p class="vc-alt"><a href="' + esc(urls.google) + '" target="_blank" rel="noopener">' + esc(t.venue.google) + '</a><a href="' + esc(urls.apple) + '" target="_blank" rel="noopener">' + esc(t.venue.apple) + '</a></p>'
      : '<p class="vc-alt"><a href="' + esc(urls.apple) + '" target="_blank" rel="noopener">' + esc(t.venue.apple) + '</a></p>';
    return '<section class="sec venue" id="venue" aria-label="' + esc(t.venue.date + ' / ' + t.venue.kicker) + '"><div class="wrap vc-grid">' +
      '<article class="vc rv"><div class="vc-ico vc-ico--num" aria-hidden="true">' + esc(day) + '</div>' +
        '<div class="vc-body"><p class="vc-label">' + esc(t.venue.date) + '</p>' +
        '<h2 class="vc-title"><time datetime="' + esc(C.event.start) + '">' + esc(longDate()) + '</time></h2>' +
        '<p class="vc-sub">' + esc(sub) + '</p>' +
        '<button type="button" class="vc-link vc-btn" data-ics>' + esc(t.venue.addToCalendar) + '</button></div></article>' +
      '<article class="vc rv" data-d="1"><div class="vc-ico" aria-hidden="true">' + pin + '</div>' +
        '<div class="vc-body"><p class="vc-label">' + esc(t.venue.kicker) + '</p>' +
        '<h2 class="vc-title">' + esc(tx(v.name)) + '</h2>' +
        (addrText ? '<p class="vc-sub">' + esc(addrText) + '</p>' : '') +
        '<a class="vc-link" href="' + esc(main) + '" target="_blank" rel="noopener">' + esc(urls.twogis ? t.venue.twogis : t.venue.openMap) + '</a>' + more + '</div></article>' +
    '</div></section>';
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
    for (var i = 1; i <= max; i++) opts += '<option value="' + i + '"' + (String(v.guests) === String(i) ? ' selected' : '') + '>' + esc(max === 2 && f.guestOne ? (i === 1 ? f.guestOne : f.guestTwo) : String(i)) + '</option>';
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
    var deadline = C.rsvp.deadline ? fill(t.deadline, { date: dateText(Lib.zonedToUtc(C.rsvp.deadline + 'T12:00', C.event.timeZone)) }) : '';
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
        EAR +
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

  function downloadIcs() {
    var t = T(), n = names(), v = C.venue;
    var pad = function (x) { return String(x).padStart(2, '0'); };
    var utc = function (ms) { var d = new Date(ms); return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z'; };
    var esc2 = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n'); };
    var end = eventMs + (C.event.durationHours || 4) * 3600000;
    var addr = v.address ? tx(v.address) : (v.addressLines || []).join(', ');
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//wedding-invitation//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
      'UID:' + utc(eventMs) + '-invitation@wedding', 'DTSTAMP:' + utc(Date.now()), 'DTSTART:' + utc(eventMs), 'DTEND:' + utc(end),
      'SUMMARY:' + esc2(n.first + ' & ' + n.second + ' · ' + t.intro.kicker), 'LOCATION:' + esc2(tx(v.name) + (addr ? ', ' + addr : '')),
      'DESCRIPTION:' + esc2(Lib.directionsUrls(v).twogis || Lib.directionsUrls(v).google), 'END:VEVENT', 'END:VCALENDAR'];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'invitation.ics'; document.body.appendChild(link); link.click();
    setTimeout(function () { document.body.removeChild(link); URL.revokeObjectURL(url); }, 1500);
  }

  function onClick(e) {
    var tgt = e.target;
    if (tgt.closest && tgt.closest('[data-ics]')) { downloadIcs(); return; }
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

  /* -------------------------------------------------- opening envelope */
  // A full-screen envelope shown on arrival. It lives outside #app so that switching
  // language (which re-renders #app) never brings it back. Turn it off in config.js: intro: false.
  function setupIntro() {
    if (C.intro === false) return;
    if (window.location.hash && window.location.hash !== '#top') return;   // shared deep links go straight in
    var t = T(), n = names();
    var initials = Array.from(n.first)[0] + '&amp;' + Array.from(n.second)[0];
    var el = document.createElement('div');
    el.className = 'open';
    el.id = 'open';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', t.intro.aria);
    el.innerHTML =
      '<div class="open-in">' +
        '<button type="button" class="env" aria-label="' + esc(t.intro.aria) + '">' +
          '<svg class="env-back" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true"><rect x="0.8" y="0.8" width="298.4" height="198.4" fill="#c5ccb4" stroke="#3f4836" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>' +
          '<span class="env-card"><span class="env-frame"></span>' + ORN + '<small>' + esc(t.intro.kicker) + '</small><b>' + esc(n.first) + '</b><i>&amp;</i><b>' + esc(n.second) + '</b><em>' + esc(longDate()) + '</em></span>' +
          '<svg class="env-front" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,0 150,112 300,0 300,200 0,200" fill="#f7f1e4" stroke="#3f4836" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/><path d="M0 200L150 112L300 200" fill="none" stroke="#3f4836" stroke-width="1.2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>' +
          '<svg class="env-flap" viewBox="0 0 300 112" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,0 300,0 150,112" fill="#e6dbc3" stroke="#3f4836" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>' +
          '<span class="env-seal" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="M96.6 50.0 L96.3 51.6 L95.3 53.2 L94.0 54.6 L92.6 56.0 L91.4 57.3 L90.6 58.6 L90.3 60.0 L90.5 61.6 L91.1 63.3 L91.8 65.2 L92.3 67.1 L92.4 68.9 L91.9 70.4 L90.8 71.7 L89.2 72.7 L87.4 73.4 L85.5 74.0 L83.9 74.6 L82.6 75.5 L81.8 76.7 L81.4 78.3 L81.2 80.1 L81.0 82.1 L80.6 84.0 L79.9 85.6 L78.7 86.7 L77.1 87.3 L75.2 87.4 L73.3 87.2 L71.4 87.0 L69.6 86.9 L68.2 87.2 L66.9 88.0 L65.9 89.3 L64.9 90.9 L63.8 92.6 L62.6 94.1 L61.2 95.1 L59.7 95.5 L58.0 95.3 L56.3 94.5 L54.6 93.5 L53.0 92.4 L51.5 91.7 L50.0 91.4 L48.5 91.7 L47.0 92.4 L45.4 93.5 L43.7 94.5 L42.0 95.3 L40.3 95.5 L38.8 95.1 L37.4 94.1 L36.2 92.6 L35.1 90.9 L34.1 89.3 L33.1 88.0 L31.8 87.2 L30.4 86.9 L28.7 87.0 L26.7 87.2 L24.8 87.4 L22.9 87.3 L21.3 86.7 L20.1 85.6 L19.4 84.0 L19.0 82.1 L18.8 80.1 L18.6 78.3 L18.2 76.7 L17.4 75.5 L16.1 74.6 L14.5 74.0 L12.6 73.4 L10.8 72.6 L9.2 71.7 L8.1 70.4 L7.6 68.9 L7.7 67.1 L8.2 65.2 L8.9 63.3 L9.5 61.6 L9.7 60.0 L9.4 58.6 L8.6 57.3 L7.4 56.0 L6.0 54.6 L4.7 53.2 L3.7 51.6 L3.4 50.0 L3.7 48.4 L4.7 46.8 L6.0 45.4 L7.4 44.0 L8.6 42.7 L9.4 41.4 L9.7 40.0 L9.5 38.4 L8.9 36.7 L8.2 34.8 L7.7 32.9 L7.6 31.1 L8.1 29.6 L9.2 28.3 L10.8 27.4 L12.6 26.6 L14.5 26.0 L16.1 25.4 L17.4 24.5 L18.2 23.3 L18.6 21.7 L18.8 19.9 L19.0 17.9 L19.4 16.0 L20.1 14.4 L21.3 13.3 L22.9 12.7 L24.8 12.6 L26.7 12.8 L28.6 13.0 L30.4 13.1 L31.8 12.8 L33.1 12.0 L34.1 10.7 L35.1 9.1 L36.2 7.4 L37.4 5.9 L38.8 4.9 L40.3 4.5 L42.0 4.7 L43.7 5.5 L45.4 6.5 L47.0 7.6 L48.5 8.3 L50.0 8.6 L51.5 8.3 L53.0 7.6 L54.6 6.5 L56.3 5.5 L58.0 4.7 L59.7 4.5 L61.2 4.9 L62.6 5.9 L63.8 7.4 L64.9 9.1 L65.9 10.7 L66.9 12.0 L68.2 12.8 L69.6 13.1 L71.3 13.0 L73.3 12.8 L75.2 12.6 L77.1 12.7 L78.7 13.3 L79.9 14.4 L80.6 16.0 L81.0 17.9 L81.2 19.9 L81.4 21.7 L81.8 23.3 L82.6 24.5 L83.9 25.4 L85.5 26.0 L87.4 26.6 L89.2 27.3 L90.8 28.3 L91.9 29.6 L92.4 31.1 L92.3 32.9 L91.8 34.8 L91.1 36.7 L90.5 38.4 L90.3 40.0 L90.6 41.4 L91.4 42.7 L92.6 44.0 L94.0 45.4 L95.3 46.8 L96.3 48.4 L96.6 50.0 Z" fill="#a3513e"/><circle cx="50" cy="50" r="34" fill="none" stroke="#f3dccb" stroke-width="1.3" opacity="0.75"/></svg><span>' + initials + '</span></span>' +
        '</button>' +
        '<p class="open-hint">' + esc(t.intro.hint) + '</p>' +
      '</div>';
    document.body.appendChild(el);
    document.documentElement.classList.add('intro-lock');
    root.setAttribute('inert', '');
    window.scrollTo(0, 0);
    var btn = el.querySelector('.env'), opened = false;
    function leave() {
      el.classList.add('is-leaving');
      document.documentElement.classList.remove('intro-lock');
      root.removeAttribute('inert');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); window.scrollTo(0, 0); }, reduceMotion ? 250 : 1000);
    }
    btn.addEventListener('click', function () {
      if (opened) return;
      opened = true;
      el.classList.add('is-open');
      setTimeout(leave, reduceMotion ? 150 : 2400);
    });
  }

  /* --------------------------------------------------------------- init */
  function init() {
    root = document.getElementById('app');
    if (!root) return;
    render();
    setupIntro();
    root.addEventListener('input', onInput);
    root.addEventListener('change', onInput);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
