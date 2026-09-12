/* ══════════════════════════════════════════════════════════════
   Photo pipeline.

   Drop the raw photographs into  photos-raw/  and run:

       npm  install sharp          (once)
       node tools/photos.mjs

   It cuts the background off the food shots, trims and resizes them,
   crops the portrait to a square, and builds the falling-herb layer out
   of a real photograph of herbs. Output goes to assets/images/ under the
   exact names the pages already look for, so nothing else has to change.

   Expected in photos-raw/  (jpg, jpeg, png or webp):

     hero-boneless      the sauce-covered boneless chicken, the centre shot
     piece-wing-1       a single wing
     piece-wing-2       another wing, different angle
     piece-drumstick-1  a single drumstick
     piece-drumstick-2  another drumstick, different angle
     taster             a person in black gloves eating fried chicken
     herbs              loose green herbs on a plain background

   Anything missing is skipped, and the page shows that slot's placeholder
   until it is supplied. See PHOTOS.md for what to shoot or source.
   ══════════════════════════════════════════════════════════════ */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.error("sharp is not installed. Run:  npm install sharp");
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RAW  = path.join(ROOT, "photos-raw");
const OUT  = path.join(ROOT, "assets", "images");

const EXT = [".png", ".jpg", ".jpeg", ".webp"];
const find = (base) => {
  for (const e of EXT) {
    const p = path.join(RAW, base + e);
    if (fs.existsSync(p)) return p;
  }
  return null;
};

/* ── background removal ───────────────────────────────────────
   Flood-fills inward from the border, clearing every pixel close enough
   in colour to the background it started from. This is the right tool for
   product shots on a plain white or plain grey ground, which is what
   stock food photography almost always is. It will not cope with a busy
   background — for those, cut the subject out first. */

async function cutout(src, { tolerance = 34, feather = 2 } = {}) {
  const img = sharp(src).ensureAlpha();
  const { width: W, height: H } = await img.metadata();
  const raw = await img.raw().toBuffer();          // RGBA

  const at = (x, y) => (y * W + x) * 4;

  /* Background colour = the median of the four corners. */
  const corners = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]].map(([x, y]) => {
    const i = at(x, y);
    return [raw[i], raw[i + 1], raw[i + 2]];
  });
  const bg = [0, 1, 2].map(c => {
    const v = corners.map(p => p[c]).sort((a, b) => a - b);
    return (v[1] + v[2]) / 2;
  });

  const near = (i) => {
    const d = Math.abs(raw[i] - bg[0]) + Math.abs(raw[i + 1] - bg[1]) + Math.abs(raw[i + 2] - bg[2]);
    return d <= tolerance * 3;
  };

  /* Iterative flood fill from every border pixel. */
  const seen = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push([x, 0], [x, H - 1]); }
  for (let y = 0; y < H; y++) { stack.push([0, y], [W - 1, y]); }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const k = y * W + x;
    if (seen[k]) continue;
    const i = k * 4;
    if (!near(i)) continue;
    seen[k] = 1;
    raw[i + 3] = 0;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  /* Soften the cut so it does not read as a paper cut-out. The blurred
     alpha is written straight back into the RGBA buffer — a removeAlpha /
     joinChannel round-trip loses the transparency here. */
  if (feather > 0) {
    const blurred = await sharp(raw, { raw: { width: W, height: H, channels: 4 } })
      .extractChannel(3).blur(feather).raw().toBuffer();
    for (let k = 0; k < W * H; k++) raw[k * 4 + 3] = blurred[k];
  }
  return sharp(raw, { raw: { width: W, height: H, channels: 4 } })
    .png()
    .trim({ threshold: 1 });
}

async function food(base, size) {
  const src = find(base);
  if (!src) { console.log("  skip  " + base + "  (not in photos-raw/)"); return; }
  const buf = await (await cutout(src)).toBuffer();
  await sharp(buf)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, quality: 88 })
    .toFile(path.join(OUT, base + ".png"));
  console.log("  ok    " + base + ".png  (" + size + "×" + size + ")");
}

/* ── the portrait ─────────────────────────────────────────────
   Square, centre-weighted toward the top third where a face usually sits.
   No background removal: it sits inside the orange disc and fills it. */

async function taster() {
  const src = find("taster");
  if (!src) { console.log("  skip  taster  (not in photos-raw/)"); return; }
  await sharp(src)
    .resize(900, 900, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT, "taster.jpg"));
  console.log("  ok    taster.jpg  (900×900)");
}

/* ── the herb throw ───────────────────────────────────────────
   Samples small flecks out of a real photograph of herbs and scatters them
   along a shallow arc, the way a pinch thrown from the right-hand side
   actually falls: dense where it left the hand, thinning and dropping as
   it spreads. Nothing here is drawn — every fleck is photographic. */

async function herbs() {
  const src = find("herbs");
  if (!src) { console.log("  skip  herbs  (not in photos-raw/)"); return; }

  const W = 1400, H = 900;

  /* Cut the background off the herb photo first, so each fleck carries the
     herb's own silhouette instead of being a square of photograph. */
  const plateBuf = await (await cutout(src, { tolerance: 40, feather: 1 }))
    .resize(1000, 1000, { fit: "inside" }).png().toBuffer();
  const pm = await sharp(plateBuf).metadata();
  const pRaw = await sharp(plateBuf).ensureAlpha().raw().toBuffer();
  const alphaAt = (x, y) => pRaw[(y * pm.width + x) * 4 + 3];

  let seed = 20260903;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;

  const flecks = [];
  const COUNT = 190;
  let placed = 0, guard = 0;

  while (placed < COUNT && guard < COUNT * 40) {
    guard++;
    const s = Math.round(14 + rnd() * 26);
    const sx = Math.round(rnd() * (pm.width - s));
    const sy = Math.round(rnd() * (pm.height - s));

    /* Only sample where there is actually a herb. */
    if (alphaAt(sx + (s >> 1), sy + (s >> 1)) < 200) continue;
    let solid = 0;
    for (let k = 0; k < 9; k++) {
      const px = sx + Math.round((k % 3) * (s - 1) / 2);
      const py = sy + Math.round(Math.floor(k / 3) * (s - 1) / 2);
      if (alphaAt(px, py) > 128) solid++;
    }
    if (solid < 4) continue;

    const t = placed / COUNT;
    const spread = Math.pow(t, 0.68);
    const x = W * (0.94 - spread * 1.02) + (rnd() - 0.5) * W * 0.13;
    const y = H * (0.06 + spread * 0.30) + Math.pow(spread, 2.1) * H * 0.52
              + (rnd() - 0.5) * H * 0.12;

    const scale = (0.55 + rnd() * 0.9) * (1 - t * 0.35);
    const size  = Math.max(5, Math.round(s * scale));
    const op    = (0.95 - t * 0.5) * (0.6 + rnd() * 0.4);

    let f = sharp(plateBuf)
      .extract({ left: sx, top: sy, width: s, height: s })
      .resize(size, size)
      .rotate(Math.round(rnd() * 360), { background: { r: 0, g: 0, b: 0, alpha: 0 } });

    /* Fade the fleck by scaling its alpha in place. */
    const fb = await f.png().toBuffer();
    const fm = await sharp(fb).metadata();
    const fr = await sharp(fb).ensureAlpha().raw().toBuffer();
    for (let k = 0; k < fm.width * fm.height; k++) fr[k * 4 + 3] *= op;
    const faded = await sharp(fr, { raw: { width: fm.width, height: fm.height, channels: 4 } })
      .png().toBuffer();

    flecks.push({
      input: faded,
      left: Math.max(0, Math.min(W - fm.width, Math.round(x))),
      top:  Math.max(0, Math.min(H - fm.height, Math.round(y)))
    });
    placed++;
  }

  if (!placed) {
    console.log("  warn  herbs: nothing usable found. Needs herbs on a plain background.");
    return;
  }

  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(flecks)
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "herb-fall.png"));
  console.log("  ok    herb-fall.png  (" + W + "×" + H + ", " + placed + " flecks)");
}

/* ── run ──────────────────────────────────────────────────── */

if (!fs.existsSync(RAW)) {
  fs.mkdirSync(RAW, { recursive: true });
  console.log("Created photos-raw/. Put the photographs there and run this again.");
  console.log("See PHOTOS.md for what each one needs to be.");
  process.exit(0);
}

console.log("Dewon photo pipeline\n");
await food("hero-boneless", 1100);
await food("piece-wing-1", 520);
await food("piece-wing-2", 520);
await food("piece-drumstick-1", 520);
await food("piece-drumstick-2", 520);
await taster();
await herbs();
console.log("\nDone. Reload the site — any slot with a photo now shows it.");
