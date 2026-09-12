/* Minimal pure-Node PNG chroma-key cutout. No dependencies.
   Decodes an 8-bit RGB or RGBA PNG, computes alpha from how close each
   pixel is to a target background colour (white or black) using a
   saturation/brightness test rather than an exact colour match, and
   writes out an RGBA PNG with that background erased.

   Usage: node tools/chroma-key.js <in.png> <out.png> <white|black> [featherLow] [featherHigh]
*/
const fs = require("fs");
const zlib = require("zlib");

function readPNG(path) {
  const buf = fs.readFileSync(path);
  let off = 8, width, height, bitDepth, colorType;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    const data = buf.slice(off + 8, off + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8); colorType = data.readUInt8(9);
    } else if (type === "IDAT") {
      idat.push(data);
    }
    off += 8 + len + 4;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  return { width, height, bitDepth, colorType, raw };
}

function channelsFor(colorType) {
  if (colorType === 6) return 4;
  if (colorType === 2) return 3;
  if (colorType === 4) return 2;
  if (colorType === 0) return 1;
  throw new Error("unsupported colorType " + colorType);
}

function unfilter(path) {
  const { width, height, bitDepth, colorType, raw } = readPNG(path);
  if (bitDepth !== 8) throw new Error("only 8-bit supported");
  const ch = channelsFor(colorType);
  const bpp = ch;
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let rOff = 0, oOff = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rOff]; rOff += 1;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[oOff + x - bpp] : 0;
      const b = y > 0 ? out[oOff - stride + x] : 0;
      const c = (y > 0 && x >= bpp) ? out[oOff - stride + x - bpp] : 0;
      let val = raw[rOff + x];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        val = (val + pr) & 0xff;
      }
      out[oOff + x] = val;
    }
    rOff += stride; oOff += stride;
  }
  return { width, height, ch, data: out };
}

function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function writePNG(path, width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); ihdr.writeUInt8(6, 9); ihdr.writeUInt8(0, 10); ihdr.writeUInt8(0, 11); ihdr.writeUInt8(0, 12);
  const stride = width * 4;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });
  const out = Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idatData), chunk("IEND", Buffer.alloc(0))]);
  fs.writeFileSync(path, out);
}

function processImage(inPath, outPath, target, featherLow, featherHigh) {
  const { width, height, ch, data } = unfilter(inPath);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0; i < width * height; i++, p += ch) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const srcAlpha = ch === 4 ? data[p + 3] : 255;
    const maxc = Math.max(r, g, b), minc = Math.min(r, g, b);
    const sat = maxc - minc;
    const bright = (r + g + b) / 3;
    let bgScore; // 0 = definitely background, 1 = definitely subject
    if (target === "white") {
      // background: bright AND low-saturation (grey/white studio backdrop)
      const satScore = clamp01((sat - featherLow) / (featherHigh - featherLow));
      const brightScore = clamp01((220 - bright) / 40); // if noticeably darker than 220, treat as subject even if low-sat
      bgScore = Math.max(satScore, brightScore);
    } else {
      // black background: dark AND low-saturation
      const satScore = clamp01((sat - featherLow) / (featherHigh - featherLow));
      const darkScore = clamp01((bright - 60) / 40); // if noticeably brighter than 60, treat as subject
      bgScore = Math.max(satScore, darkScore);
    }
    const alpha = Math.round(bgScore * 255) * (srcAlpha / 255);
    const o = i * 4;
    rgba[o] = r; rgba[o + 1] = g; rgba[o + 2] = b; rgba[o + 3] = Math.max(0, Math.min(255, alpha));
  }
  writePNG(outPath, width, height, rgba);
}

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

const args = process.argv.slice(2);
processImage(args[0], args[1], args[2], args[3] ? +args[3] : 14, args[4] ? +args[4] : 45);
console.log("wrote", args[1]);
