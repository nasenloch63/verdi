// Renders a seamless, self-made dark walnut plank tile (no stock photo, never stretched) with sharp.
const path = require('path');
const sharp = require(path.join(process.argv[2], 'node_modules', 'sharp'));
const out = process.argv[3];
const W = 768, H = 512, PL = 128; // 4 horizontal planks per tile
const grainSvg = (seedA, seedB) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
<filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.0052 0.118" numOctaves="4" seed="${seedA}" stitchTiles="stitch" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.56  0 0 0 0 0.36  0 0 0 0 0.20  1.7 0 0 0 -0.70"/>
</filter>
<filter id="fine" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.013 0.46" numOctaves="3" seed="${seedB}" stitchTiles="stitch" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.03  0 0 0 0 0.015  0 0 0 0 0.0  0 1.6 0 0 -0.62"/>
</filter>
</defs>
<rect width="${W}" height="${H}" fill="#21140c"/>
<rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.46"/>
<rect width="${W}" height="${H}" filter="url(#fine)" opacity="0.7"/>
</svg>`;
const tones = [0.0, 0.055, -0.045, 0.03];
const joints = [210, 596, 92, 430]; // staggered butt joints per plank row
const planksSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${tones.map((t, i) => {
  const y = i * PL;
  const fill = t >= 0 ? `rgba(214,160,96,${t})` : `rgba(0,0,0,${-t * 2.4})`;
  return `<rect x="0" y="${y}" width="${W}" height="${PL}" fill="${fill}"/>
  <rect x="0" y="${y}" width="${W}" height="1.6" fill="rgba(0,0,0,0.6)"/>
  <rect x="0" y="${y + 1.6}" width="${W}" height="1.1" fill="rgba(226,178,116,0.09)"/>
  <rect x="${joints[i]}" y="${y}" width="1.5" height="${PL}" fill="rgba(0,0,0,0.5)"/>
  <rect x="${joints[i] + 1.5}" y="${y}" width="1" height="${PL}" fill="rgba(226,178,116,0.07)"/>`;
}).join('')}</svg>`;
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.34" stop-color="#fff" stop-opacity="0"/><stop offset="0.47" stop-color="#fff" stop-opacity="1"/><stop offset="0.53" stop-color="#fff" stop-opacity="1"/><stop offset="0.66" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>`;
(async () => {
  const A = await sharp(Buffer.from(grainSvg(11, 4))).png().toBuffer();
  const B = await sharp(Buffer.from(grainSvg(23, 9))).png().toBuffer();
  // wrap A by half a tile so its seam sits in the centre...
  const left = await sharp(A).extract({ left: W / 2, top: 0, width: W / 2, height: H }).toBuffer();
  const right = await sharp(A).extract({ left: 0, top: 0, width: W / 2, height: H }).toBuffer();
  const Aoff = await sharp({ create: { width: W, height: H, channels: 3, background: '#000' } })
    .composite([{ input: left, left: 0, top: 0 }, { input: right, left: W / 2, top: 0 }]).png().toBuffer();
  // ...and cover that centre seam with B through a soft mask.
  const Bmasked = await sharp(B).ensureAlpha().composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }]).png().toBuffer();
  const tile = await sharp(Aoff).composite([{ input: Bmasked }, { input: Buffer.from(planksSvg) }]).png().toBuffer();
  await sharp(tile).webp({ quality: 80 }).toFile(path.join(out, 'walnut-planks.webp'));
  await sharp({ create: { width: W * 2, height: H * 2, channels: 3, background: '#000' } })
    .composite([{ input: tile, left: 0, top: 0 }, { input: tile, left: W, top: 0 }, { input: tile, left: 0, top: H }, { input: tile, left: W, top: H }])
    .jpeg({ quality: 82 }).toFile(path.join(process.argv[4], 'walnut-proof.jpg'));
  console.log('walnut-planks.webp', (require('fs').statSync(path.join(out, 'walnut-planks.webp')).size / 1024).toFixed(1), 'KB');
})();
