// Generates the demonstration artwork (src/images/*.svg).
// Replace these with real photographs; see README.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'images');
fs.mkdirSync(out, { recursive: true });

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const R = (a, b) => a + (b - a) * rnd();
const n1 = (n) => Math.round(n * 10) / 10;
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

const grain = (id, s, k = 0.22) =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${s}"/><feColorMatrix type="matrix" values="0 0 0 0 .22  0 0 0 0 .2  0 0 0 0 .16  ${k} 0 0 0 0"/></filter>`;

const svg = (w, h, defs, body, gid = 'g', gseed = 3, gk) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>${defs}${grain(gid, gseed, gk)}<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter><filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>${body}<rect width="${w}" height="${h}" filter="url(#${gid})"/></svg>`;

const lin = (id, stops, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad = (id, stops) =>
  `<radialGradient id="${id}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;

function hill(w, h, y0, amp, f1, f2, fill, extra = '') {
  const p1 = R(0, 6), p2 = R(0, 6);
  let d = `M0 ${h}`;
  for (let x = 0; x <= w; x += 16) {
    const y = y0 + amp * (Math.sin(x * f1 + p1) * 0.6 + Math.sin(x * f2 + p2) * 0.4);
    d += ` L${x} ${n1(y)}`;
  }
  return `<path d="${d} L${w} ${h} Z" fill="${fill}" ${extra}/>`;
}

function grass(w, y, n, hMin, hMax, color, sw = 1.3) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = R(0, w), h = R(hMin, hMax), l = R(-22, 22);
    s += `<path d="M${n1(x)} ${y + R(0, 60)} Q${n1(x + l * 0.3)} ${n1(y - h * 0.5)} ${n1(x + l)} ${n1(y - h)}" stroke="${color}" stroke-width="${n1(R(sw * 0.7, sw * 1.4))}" fill="none" stroke-linecap="round" opacity="${n1(R(0.55, 1))}"/>`;
  }
  return s;
}

function leaf(x, y, len, wid, ang, fill) {
  const rad2 = (ang * Math.PI) / 180;
  const cx = x + Math.cos(rad2) * len / 2, cy = y + Math.sin(rad2) * len / 2;
  return `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(len / 2)}" ry="${n1(wid / 2)}" transform="rotate(${n1(ang)} ${n1(cx)} ${n1(cy)})" fill="${fill}"/>`;
}

const arch = (cx, base, half, topY, thick) => {
  const r = half, rin = half - thick;
  const sp = topY + r;
  return `M${cx - r} ${base} V${sp} A${r} ${r} 0 0 1 ${cx + r} ${sp} V${base} Z M${cx - rin} ${base} V${sp} A${rin} ${rin} 0 0 1 ${cx + rin} ${sp} V${base} Z`;
};

function archPoint(t, cx, base, half, topY, inset = 0) {
  const r = half - inset, sp = topY + half;
  const v = base - sp, arc = Math.PI * r;
  const total = v * 2 + arc;
  let d = t * total;
  if (d < v) return [cx - r, base - d];
  d -= v;
  if (d < arc) { const a = Math.PI - d / r; return [cx + Math.cos(a) * r, sp - Math.sin(a) * r]; }
  d -= arc;
  return [cx + r, sp + d];
}

function archGreens(cx, base, half, topY, count) {
  let s = '';
  const greens = ['#4b5640', '#5d6a4c', '#738060', '#8a9673'];
  for (let i = 0; i < count; i++) {
    const t = R(0.05, 0.95);
    const [x, y] = archPoint(t, cx, base, half, topY, R(-6, 14));
    s += leaf(x, y, R(26, 56), R(9, 17), R(0, 360), pick(greens));
  }
  for (let i = 0; i < count / 3; i++) {
    const [x, y] = archPoint(R(0.08, 0.92), cx, base, half, topY, R(-4, 12));
    const r = R(5, 10);
    s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="${pick(['#f8f5ef', '#efe2d0', '#e8d3c4'])}"/><circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 0.35)}" fill="#d9b87c"/>`;
  }
  return s;
}

const motes = (w, h, n, color = '#fff6e6') => {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle cx="${n1(R(0, w))}" cy="${n1(R(h * 0.15, h * 0.85))}" r="${n1(R(1, 3.2))}" fill="${color}" opacity="${n1(R(0.15, 0.6))}"/>`;
  return s;
};

const write = (name, content) => fs.writeFileSync(path.join(out, name), content);

/* ---------------------------------------------------------------- hero */
{
  const W = 1600, H = 1000, cx = 800;
  seed = 11;
  const defs =
    lin('sky', [[0, '#d6dfd0'], [0.42, '#f3eee0'], [0.7, '#f8e3cc'], [1, '#fbecd9']]) +
    rad('sunglow', [[0, '#fff3dc', 0.95], [0.35, '#fbe0b8', 0.45], [1, '#fbe0b8', 0]]) +
    rad('vig', [[0.6, '#000', 0], [1, '#5a6650', 0.12]]) +
    lin('hillA', [[0, '#cfd6c0'], [1, '#c1c9b0']]) +
    lin('hillB', [[0, '#b2bca0'], [1, '#a4af92']]) +
    lin('hillC', [[0, '#93a07f'], [1, '#869573']]) +
    lin('hillD', [[0, '#7a8b68'], [1, '#6d7f5d']]);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  b += `<circle cx="${cx}" cy="560" r="480" fill="url(#sunglow)"/>`;
  b += `<circle cx="${cx}" cy="560" r="96" fill="#fff6e6" opacity=".96"/>`;
  b += `<g filter="url(#b)" fill="#fbf1e0" opacity=".5"><ellipse cx="300" cy="300" rx="330" ry="26"/><ellipse cx="1320" cy="250" rx="300" ry="22"/><ellipse cx="1050" cy="400" rx="240" ry="16"/><ellipse cx="520" cy="470" rx="260" ry="14"/></g>`;
  b += hill(W, H, 640, 22, 0.004, 0.011, 'url(#hillA)');
  b += hill(W, H, 700, 26, 0.005, 0.013, 'url(#hillB)');
  b += `<path d="${arch(cx, 860, 135, 372, 30)}" fill="#5d6b4d" fill-rule="evenodd"/>`;
  b += archGreens(cx, 860, 135, 372, 90);
  b += hill(W, H, 770, 20, 0.006, 0.016, 'url(#hillC)');
  b += hill(W, H, 840, 16, 0.008, 0.02, 'url(#hillD)');
  b += grass(W, 900, 220, 28, 120, '#55654a');
  b += grass(W, 780, 90, 14, 46, '#7d8d6b', 1);
  b += motes(W, H, 55);
  b += `<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
  write('hero.svg', svg(W, H, defs, b, 'g1', 5));
}

/* --------------------------------------------------------------- story 1 */
{
  const W = 800, H = 1000;
  seed = 21;
  const defs =
    lin('bg', [[0, '#d2d5c4'], [1, '#a5aa96']]) +
    lin('win', [[0, '#fff9ee'], [1, '#f1e1c7']]) +
    lin('spill', [[0, '#fff3dc', 0.55], [1, '#fff3dc', 0]]) +
    lin('floor', [[0, '#8f967f'], [1, '#6f775f']]);
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  b += `<rect y="820" width="${W}" height="180" fill="url(#floor)"/>`;
  b += `<path d="M200 820 L600 820 L780 1000 L20 1000 Z" fill="url(#spill)"/>`;
  b += `<path d="M180 840 V420 A220 220 0 0 1 620 420 V840 Z" fill="#41483a" opacity=".35"/>`;
  b += `<path d="M200 820 V420 A200 200 0 0 1 600 420 V820 Z" fill="url(#win)"/>`;
  b += `<g stroke="#41483a" stroke-width="7" fill="none" opacity=".85"><path d="M400 220 V820"/><path d="M200 420 H600"/><path d="M200 600 H600"/><path d="M200 740 H600"/><path d="M200 820 V420 A200 200 0 0 1 600 420 V820 Z" stroke-width="12"/></g>`;
  b += `<g filter="url(#b2)" opacity=".5">${motes(W, H, 40, '#fff')}</g>`;
  // branches in a vase, left
  b += `<path d="M95 960 Q70 800 120 640" stroke="#41483a" stroke-width="3" fill="none"/><path d="M95 960 Q140 820 90 700" stroke="#41483a" stroke-width="3" fill="none"/>`;
  for (let i = 0; i < 26; i++) b += leaf(R(70, 140), R(640, 900), R(26, 52), R(9, 15), R(-130, -30), pick(['#4b5640', '#5d6a4c', '#738060']));
  b += `<path d="M60 960 Q60 905 95 895 Q130 905 130 960 Z" fill="#e9dfd2"/>`;
  write('story1.svg', svg(W, H, defs, b, 'g2', 8));
}

/* --------------------------------------------------------------- story 2 */
{
  const W = 800, H = 1000;
  seed = 31;
  const defs = lin('bg', [[0, '#efe6d9'], [1, '#d9cbb8']]) + rad('sun', [[0, '#fff6e6', 0.9], [1, '#fff6e6', 0]]);
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/><circle cx="220" cy="240" r="260" fill="url(#sun)"/>`;
  const P = [[130, 990], [260, 700], [380, 540], [660, 110]];
  const bez = (t) => {
    const u = 1 - t;
    return [0, 1].map((i) => u ** 3 * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t ** 3 * P[3][i]);
  };
  const tan = (t) => {
    const u = 1 - t;
    const d = [0, 1].map((i) => 3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]));
    return (Math.atan2(d[1], d[0]) * 180) / Math.PI;
  };
  b += `<path d="M${P[0]} C${P[1]} ${P[2]} ${P[3]}" stroke="#4a5240" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  const cols = ['#4b5640', '#5d6a4c', '#738060', '#8a9673', '#a5aa96'];
  for (let t = 0.1, k = 0; t < 0.99; t += 0.035, k++) {
    const [x, y] = bez(t), a = tan(t), len = 120 - t * 70;
    b += leaf(x, y, len, len * 0.27, a - 52, pick(cols));
    b += leaf(x, y, len * 0.92, len * 0.25, a + 52, pick(cols));
    if (k % 5 === 2) b += `<ellipse cx="${n1(x + 20)}" cy="${n1(y + 26)}" rx="11" ry="14" fill="#3a4033"/><path d="M${n1(x + 20)} ${n1(y + 12)} L${n1(x + 14)} ${n1(y - 2)}" stroke="#3a4033" stroke-width="2"/>`;
  }
  b += `<path d="M60 1000 V930 H740 V1000 Z" fill="#cdbfa9" opacity=".6"/>`;
  write('story2.svg', svg(W, H, defs, b, 'g3', 12));
}

/* --------------------------------------------------------------- story 3 */
{
  const W = 800, H = 1000;
  seed = 41;
  const defs =
    lin('sky', [[0, '#c9cdbb'], [0.5, '#eedcc3'], [1, '#f4cba5']]) +
    rad('glow', [[0, '#fff1d6', 0.9], [1, '#fff1d6', 0]]) +
    lin('f1', [[0, '#7f8a70'], [1, '#5a654d']]) + lin('f2', [[0, '#4b5640'], [1, '#2f3628']]);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/><circle cx="400" cy="610" r="340" fill="url(#glow)"/><circle cx="400" cy="620" r="64" fill="#fff4e0"/>`;
  b += hill(W, H, 650, 20, 0.006, 0.014, 'url(#f1)');
  b += hill(W, H, 740, 14, 0.008, 0.02, 'url(#f2)');
  for (let i = 0; i < 22; i++) {
    const y = 760 + i * i * 0.55 + i * 3;
    b += `<path d="M0 ${n1(y + 14)} Q${W / 2} ${n1(y - 12 - i * 0.6)} ${W} ${n1(y + 14)}" stroke="#a5aa96" stroke-width="${n1(0.6 + i * 0.12)}" fill="none" opacity="${n1(0.18 + i * 0.012)}"/>`;
  }
  b += grass(W, 960, 130, 30, 130, '#1f261a', 1.5);
  b += motes(W, H, 25);
  write('story3.svg', svg(W, H, defs, b, 'g4', 17));
}

/* ----------------------------------------------------------------- venue */
{
  const W = 1200, H = 800;
  seed = 51;
  const defs =
    lin('sky', [[0, '#dfe0d2'], [1, '#f3e6d2']]) + lin('ground', [[0, '#c9c6a8'], [1, '#a7ab8f']]) +
    lin('path', [[0, '#eadfce'], [1, '#d9c9b1']]) + rad('lit', [[0, '#fff3dc', 0.95], [1, '#fff3dc', 0]]);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  b += hill(W, H, 380, 14, 0.006, 0.013, '#b4baa3');
  b += `<rect y="430" width="${W}" height="370" fill="url(#ground)"/>`;
  b += `<path d="M560 430 L640 430 L860 800 L340 800 Z" fill="url(#path)"/>`;
  const arches = [[600, 520, 70, 250, 14, '#5d6650'], [600, 470, 52, 190, 10, '#6e7a60']];
  // far to near so near arches overlap
  const set = [[600, 468, 38, 332, 7, '#7b8670'], [600, 500, 56, 300, 9, '#6a7660'], [600, 560, 84, 250, 12, '#566148'], [600, 680, 126, 170, 17, '#3f4833']];
  for (const [cx, base, half, top, th, col] of set) {
    b += `<circle cx="${cx}" cy="${top + half + (base - top - half) * 0.45}" r="${half * 1.5}" fill="url(#lit)" opacity=".7"/>`;
    b += `<path d="${arch(cx, base, half, top, th)}" fill="${col}" fill-rule="evenodd"/>`;
    b += archGreens(cx, base, half, top, 26 + Math.round(half / 3));
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 6; i++) {
      const x = 600 + side * (R(230, 560)), y = R(430, 760), r = R(40, 110);
      b += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(r * 1.3)}" ry="${n1(r)}" fill="${pick(['#6e7a60', '#7f8a70', '#566148', '#8a9673'])}" opacity=".9"/>`;
    }
  }
  b += grass(W, 800, 150, 20, 70, '#3a4231');
  b += motes(W, H, 40);
  write('venue.svg', svg(W, H, defs, b, 'g5', 23));
}

/* ----------------------------------------------------------------- dress */
{
  const W = 800, H = 1000;
  seed = 61;
  const cols = ['#a5aa96', '#41483a', '#d9c7ae', '#b98e7a', '#7c8776', '#e9dfd2'];
  const defs = lin('bg', [[0, '#efe8dc'], [1, '#e1d4c1']]) + lin('hl', [[0, '#fff', 0.35], [1, '#fff', 0]], 1, 0);
  let b = `<rect width="${W}" height="${H}" fill="url(#bg)"/>`;
  for (let i = 0; i < 8; i++) {
    const y = 40 + i * 130, a = R(40, 80), ph = R(0, 6), f = R(0.004, 0.009);
    let d = `M0 ${H}`;
    for (let x = 0; x <= W; x += 16) d += ` L${x} ${n1(y + a * Math.sin(x * f * 3 + ph) + x * R(0.02, 0.05))}`;
    d += ` L${W} ${H} Z`;
    b += `<path d="${d}" fill="${cols[i % cols.length]}" opacity=".94"/>`;
    b += `<path d="${d}" fill="url(#hl)"/>`;
  }
  write('dress.svg', svg(W, H, defs, b, 'g6', 29, 0.18));
}

/* --------------------------------------------------------------- closing */
{
  const W = 1600, H = 1000;
  seed = 71;
  const defs =
    lin('sky', [[0, '#dfe5d6'], [0.55, '#f4eadb'], [1, '#f8dcc2']]) +
    rad('moon', [[0, '#fff6e4', 0.9], [1, '#fff6e4', 0]]) +
    lin('h1', [[0, '#b7c1a5'], [1, '#a9b496']]) + lin('h2', [[0, '#8fa07c'], [1, '#7f9070']]) +
    rad('lit', [[0, '#ffe7bd', 0.9], [1, '#ffe7bd', 0]]);
  let b = `<rect width="${W}" height="${H}" fill="url(#sky)"/>`;
  b += `<circle cx="1180" cy="260" r="320" fill="url(#moon)"/><circle cx="1180" cy="260" r="62" fill="#fffaf0" opacity=".98"/>`;
  b += hill(W, H, 640, 24, 0.004, 0.011, '#cbd3bb');
  b += hill(W, H, 720, 20, 0.005, 0.013, 'url(#h1)');
  b += `<circle cx="560" cy="700" r="190" fill="url(#lit)"/>`;
  b += `<path d="${arch(560, 800, 100, 520, 22)}" fill="#5d6b4d" fill-rule="evenodd"/>`;
  b += archGreens(560, 800, 100, 520, 60);
  b += hill(W, H, 810, 16, 0.007, 0.018, 'url(#h2)');
  b += grass(W, 930, 200, 24, 100, '#5f7050');
  b += motes(W, H, 40);
  write('closing.svg', svg(W, H, defs, b, 'g7', 31, 0.14));
}

console.log('Artwork written to', out);
