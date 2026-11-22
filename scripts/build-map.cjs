// Builds a stylised, self-hosted SVG neighbourhood map from OpenStreetMap data (ODbL).
// usage: node build-map.cjs <osm.json> <buildings.json> <out.svg>
const fs = require('fs');
const [, , osmPath, bldPath, outPath] = process.argv;
const osm = JSON.parse(fs.readFileSync(osmPath, 'utf8')).elements;
const bld = JSON.parse(fs.readFileSync(bldPath, 'utf8')).elements;

const CENTER = { lat: 51.19648, lon: 9.72394 }; // Restaurant Verdi building centre
const VIEW_W = 1000;
const VIEW_H = 625;
const METERS_W = 880;
const S = VIEW_W / METERS_W;
const M_LAT = 111320;
const M_LON = 111320 * Math.cos((CENTER.lat * Math.PI) / 180);

const r1 = (n) => Math.round(n * 10) / 10;
const proj = (p) => [
  (p.lon - CENTER.lon) * M_LON * S + VIEW_W / 2,
  (CENTER.lat - p.lat) * M_LAT * S + VIEW_H / 2,
];
const pts = (way) => (way.geometry || []).map(proj);
const MARGIN = 30;
const inView = (ps) =>
  ps.some(([x, y]) => x > -MARGIN && x < VIEW_W + MARGIN && y > -MARGIN && y < VIEW_H + MARGIN);

function simplify(ps, tol) {
  if (ps.length < 3) return ps;
  const keep = new Array(ps.length).fill(false);
  keep[0] = keep[ps.length - 1] = true;
  const stack = [[0, ps.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0;
    let idx = -1;
    const [ax, ay] = ps[a];
    const [bx, by] = ps[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * ps[i][0] - dx * ps[i][1] + bx * ay - by * ax) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = true;
      stack.push([a, idx], [idx, b]);
    }
  }
  return ps.filter((_, i) => keep[i]);
}

function toD(ps, close) {
  let d = '';
  let px = 0;
  let py = 0;
  ps.forEach(([x, y], i) => {
    const X = r1(x);
    const Y = r1(y);
    if (i === 0) d += `M${X} ${Y}`;
    else {
      const dx = r1(X - px);
      const dy = r1(Y - py);
      if (dx === 0 && dy === 0) return;
      d += `l${dx} ${dy}`;
    }
    px = X;
    py = Y;
  });
  return d + (close ? 'z' : '');
}
const lenOf = (ps) => ps.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - ps[i][0], p[1] - ps[i][1]), 0);
const centroid = (ps) => [
  ps.reduce((a, p) => a + p[0], 0) / ps.length,
  ps.reduce((a, p) => a + p[1], 0) / ps.length,
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- areas ----------
const green = [];
const water = [];
const parking = [];
const pois = [];
const roads = { major: [], street: [], lane: [], foot: [] };
const tram = [];
const named = {};
let maxLen = { major: 0, street: 0 };

for (const e of osm) {
  if (e.type !== 'way') continue;
  const t = e.tags || {};
  const ps = pts(e);
  if (!ps.length || !inView(ps)) continue;

  if (t.natural === 'water') water.push(toD(simplify(ps, 0.5), true));
  else if (t.waterway) water.push(null), roads.water = (roads.water || []).concat(toD(simplify(ps, 0.5)));
  else if (t.leisure || t.landuse || t.natural === 'wood') green.push(toD(simplify(ps, 0.6), true));
  else if (t.amenity === 'parking') parking.push({ d: toD(simplify(ps, 0.5), true), c: centroid(ps), n: ps.length, ps });
  else if (t.amenity) pois.push({ kind: t.amenity, name: t.name || '', c: centroid(ps) });
  else if (t.railway === 'tram') tram.push(toD(simplify(ps, 0.4)));
  else if (t.highway) {
    const h = t.highway;
    if (h === 'platform') {
      pois.push({ kind: 'tram_stop', name: t.name || '', c: centroid(ps) });
      continue;
    }
    let cls = null;
    if (/^(secondary|secondary_link|primary|tertiary)/.test(h)) cls = 'major';
    else if (/^(residential|living_street|unclassified|pedestrian)$/.test(h)) cls = 'street';
    else if (h === 'service') cls = 'lane';
    else if (/^(footway|path|steps|track)$/.test(h)) cls = 'foot';
    if (!cls) continue;
    const sp = simplify(ps, 0.45);
    roads[cls].push(toD(sp));
    if (maxLen[cls] !== undefined) maxLen[cls] = Math.max(maxLen[cls], lenOf(sp));
    if (t.name && (cls === 'major' || cls === 'street')) {
      (named[t.name] = named[t.name] || { cls, ways: [] }).ways.push(ps);
    }
  }
}

// ---------- buildings ----------
let bldD = '';
let verdiD = '';
let bldCount = 0;
for (const e of bld) {
  const ps = pts(e);
  if (!ps.length || !inView(ps)) continue;
  const t = e.tags || {};
  const d = toD(ps, true);
  if (t.name === 'Restaurant Verdi') verdiD = d;
  else {
    bldD += d;
    bldCount++;
  }
}

// ---------- street labels (merge same-name ways into chains) ----------
function chain(ways) {
  const segs = ways.map((w) => w.slice());
  const key = (p) => `${r1(p[0])},${r1(p[1])}`;
  let merged = true;
  while (merged) {
    merged = false;
    outer: for (let i = 0; i < segs.length; i++) {
      for (let j = 0; j < segs.length; j++) {
        if (i === j) continue;
        const a = segs[i];
        const b = segs[j];
        const aE = key(a[a.length - 1]);
        const aS = key(a[0]);
        const bS = key(b[0]);
        const bE = key(b[b.length - 1]);
        let res = null;
        if (aE === bS) res = a.concat(b.slice(1));
        else if (aE === bE) res = a.concat(b.slice().reverse().slice(1));
        else if (aS === bE) res = b.concat(a.slice(1));
        else if (aS === bS) res = b.slice().reverse().concat(a.slice(1));
        if (res) {
          segs[i] = res;
          segs.splice(j, 1);
          merged = true;
          break outer;
        }
      }
    }
  }
  return segs;
}
const PAD = 26;
function clipToView(ps) {
  // longest run of consecutive points inside the padded view
  let best = [];
  let cur = [];
  for (const p of ps) {
    if (p[0] > PAD && p[0] < VIEW_W - PAD && p[1] > PAD && p[1] < VIEW_H - PAD) cur.push(p);
    else {
      if (lenOf(cur) > lenOf(best)) best = cur;
      cur = [];
    }
  }
  if (lenOf(cur) > lenOf(best)) best = cur;
  return best;
}
// smooth polyline -> quadratic path for nicer text flow
function smoothD(ps) {
  if (ps.length < 3) return toD(ps);
  let d = `M${r1(ps[0][0])} ${r1(ps[0][1])}`;
  for (let i = 1; i < ps.length - 1; i++) {
    const mx = (ps[i][0] + ps[i + 1][0]) / 2;
    const my = (ps[i][1] + ps[i + 1][1]) / 2;
    d += `Q${r1(ps[i][0])} ${r1(ps[i][1])} ${r1(mx)} ${r1(my)}`;
  }
  const l = ps[ps.length - 1];
  return d + `L${r1(l[0])} ${r1(l[1])}`;
}

const labels = [];
for (const [name, info] of Object.entries(named)) {
  const chains = chain(info.ways).map(clipToView).filter((c) => c.length > 1);
  if (!chains.length) continue;
  chains.sort((a, b) => lenOf(b) - lenOf(a));
  let c = simplify(chains[0], 2.4);
  const L = lenOf(c);
  const fs_ = info.cls === 'major' ? 12.5 : 11;
  const need = name.length * fs_ * 0.56 + 14;
  if (L < need) continue;
  if (c[c.length - 1][0] < c[0][0]) c = c.slice().reverse();
  labels.push({ name, cls: info.cls, d: smoothD(c), L });
}
labels.sort((a, b) => (a.name === 'Desseler Straße' ? -1 : b.name === 'Desseler Straße' ? 1 : b.L - a.L));
const keepLabels = labels.slice(0, 20);

// ---------- parking near the restaurant ----------
const cx = VIEW_W / 2;
const cy = VIEW_H / 2;
const nearParking = parking
  .map((p) => ({ ...p, dist: Math.hypot(p.c[0] - cx, p.c[1] - cy) }))
  .filter((p) => p.dist < 230)
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 4);

// ---------- POIs ----------
const poiOut = [];
const seen = new Set();
for (const p of pois) {
  const [x, y] = p.c;
  if (x < 40 || x > VIEW_W - 40 || y < 30 || y > VIEW_H - 30) continue;
  let label = null;
  let icon = null;
  if (p.kind === 'school') {
    label = p.name ? 'Freiherr-vom-Stein-Schule' : 'Grundschule';
    icon = 'school';
  } else if (p.kind === 'townhall') {
    label = 'Rathaus';
    icon = 'hall';
  } else if (p.kind === 'place_of_worship') {
    label = p.name ? 'Kirche' : null;
    icon = 'church';
  } else if (p.kind === 'tram_stop') {
    label = p.name.replace('Hessisch Lichtenau ', 'Tram · ');
    icon = 'tram';
  }
  if (!label || seen.has(label)) continue;
  seen.add(label);
  poiOut.push({ x: r1(x), y: r1(y), label, icon, raw: p });
}

// ---------- assemble ----------
const defs = [
  `<path id="vm-major" d="${roads.major.join('')}"/>`,
  `<path id="vm-street" d="${roads.street.join('')}"/>`,
  ...keepLabels.map((l, i) => `<path id="vm-l${i}" d="${l.d}"/>`),
].join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid slice" class="vm-svg" role="img" aria-labelledby="vm-title vm-desc" style="--vm-major-len:${Math.ceil(maxLen.major)};--vm-street-len:${Math.ceil(maxLen.street)}">
<title id="vm-title">Lageplan Ristorante Verdi, Desseler Straße 15, Hessisch Lichtenau</title>
<desc id="vm-desc">Gezeichnete Straßenkarte der Innenstadt von Hessisch Lichtenau. Das Ristorante Verdi liegt in der Kartenmitte an der Desseler Straße.</desc>
<defs>${defs}</defs>
<g class="vm-areas">
<path class="vm-green" d="${green.join('')}"/>
<path class="vm-water" d="${water.filter(Boolean).join('')}"/>
<path class="vm-parking" d="${nearParking.map((p) => p.d).join('')}"/>
<path class="vm-bld" d="${bldD}"/>
</g>
<g class="vm-roads" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path class="vm-stream" d="${(roads.water || []).join('')}"/>
<path class="vm-foot" d="${roads.foot.join('')}"/>
<path class="vm-lane" d="${roads.lane.join('')}"/>
<use href="#vm-street" class="vm-street-case"/>
<use href="#vm-major" class="vm-major-case"/>
<use href="#vm-street" class="vm-street-fill"/>
<use href="#vm-major" class="vm-major-fill"/>
<path class="vm-tram" d="${tram.join('')}"/>
</g>
<path class="vm-verdi" d="${verdiD}"/>
<g class="vm-labels">
${keepLabels
  .map(
    (l, i) =>
      `<text class="vm-label vm-label-${l.cls}${l.name === 'Desseler Straße' ? ' vm-label-home' : ''}" dy="${l.cls === 'major' ? 4.2 : 3.6}"><textPath href="#vm-l${i}" startOffset="50%" text-anchor="middle">${esc(l.name)}</textPath></text>`
  )
  .join('\n')}
</g>
<g class="vm-pois">
${nearParking
  .map((p) => `<g class="vm-poi vm-poi-p" transform="translate(${r1(p.c[0])} ${r1(p.c[1])})"><rect x="-7.5" y="-7.5" width="15" height="15" rx="3.5"/><text y="4.1" text-anchor="middle">P</text></g>`)
  .join('\n')}
${poiOut
  .map(
    (p) =>
      `<g class="vm-poi vm-poi-${p.icon}" transform="translate(${p.x} ${p.y})"><circle r="4.2"/><text x="9" y="4" class="vm-poi-label">${esc(p.label)}</text></g>`
  )
  .join('\n')}
</g>
</svg>`;

fs.writeFileSync(outPath, svg);
console.log('written', outPath, (svg.length / 1024).toFixed(1) + ' KB');
console.log({ buildings: bldCount, verdi: !!verdiD, major: roads.major.length, street: roads.street.length, lane: roads.lane.length, foot: roads.foot.length, tram: tram.length, green: green.length, maxLen });
console.log('labels:', keepLabels.map((l) => l.name).join(', '));
console.log('pois:', poiOut.map((p) => `${p.label}@${p.x},${p.y}`).join(' | '));
console.log('parking:', nearParking.map((p) => `${r1(p.c[0])},${r1(p.c[1])} d=${Math.round(p.dist)}`).join(' | '));
console.log('all pois raw:', pois.map((p) => `${p.kind}:${p.name}@${r1(p.c[0])},${r1(p.c[1])}`).join(' | '));
