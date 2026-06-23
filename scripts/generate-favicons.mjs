import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

// SikshaWallah brand colors
const DARK_BLUE = "#0D1B3E";
const GOLD = "#F5A623";

// SVG graduation cap — bold, readable at tiny sizes
function capSvg(size) {
  const r = Math.round(size * 0.12);          // corner radius
  const scale = size / 512;

  // cap path scaled to 512x512 canvas then scaled via transform
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- dark blue rounded background -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${DARK_BLUE}"/>

  <g transform="scale(${scale})">
    <!-- board (cap top) -->
    <polygon points="256,120 460,208 256,296 52,208" fill="${GOLD}"/>
    <!-- cap body -->
    <rect x="184" y="290" width="144" height="96" rx="8" fill="${GOLD}"/>
    <!-- tassel stem -->
    <rect x="436" y="208" width="16" height="80" rx="8" fill="${GOLD}" opacity="0.9"/>
    <!-- tassel ball -->
    <circle cx="444" cy="300" r="20" fill="${GOLD}"/>
    <!-- tassel strands -->
    <line x1="432" y1="300" x2="420" y2="340" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <line x1="444" y1="302" x2="444" y2="345" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
    <line x1="456" y1="300" x2="468" y2="340" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" opacity="0.85"/>
  </g>
</svg>`;
}

// 32×32 has very few pixels — use a heavier, simpler cap
function capSvgSmall(size) {
  const r = Math.round(size * 0.18);
  const s = size / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${DARK_BLUE}"/>
  <g transform="scale(${s})">
    <polygon points="16,7 29,13 16,19 3,13" fill="${GOLD}"/>
    <rect x="11" y="19" width="10" height="6" rx="1" fill="${GOLD}"/>
    <rect x="27" y="13" width="2" height="6" rx="1" fill="${GOLD}" opacity="0.9"/>
    <circle cx="28" cy="20" r="1.5" fill="${GOLD}"/>
  </g>
</svg>`;
}

// Apple touch icon: 180×180, more padding, slightly larger cap
function appleSvg() {
  const size = 180;
  const r = Math.round(size * 0.22);
  const s = size / 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${DARK_BLUE}"/>
  <g transform="scale(${s})">
    <polygon points="256,130 450,215 256,300 62,215" fill="${GOLD}"/>
    <rect x="188" y="294" width="136" height="90" rx="10" fill="${GOLD}"/>
    <rect x="432" y="215" width="14" height="76" rx="7" fill="${GOLD}" opacity="0.9"/>
    <circle cx="439" cy="303" r="18" fill="${GOLD}"/>
  </g>
</svg>`;
}

async function makePng(svgStr, outPath) {
  await sharp(Buffer.from(svgStr)).png({ compressionLevel: 9 }).toFile(outPath);
  console.log("  ✓", outPath.split("/public/")[1]);
}

// Build a minimal 16×16 ICO from a PNG buffer
async function makeIco(svgStr, outPath) {
  const pngBuf = await sharp(Buffer.from(svgStr))
    .resize(16, 16)
    .png()
    .toBuffer();

  // ICO format: ICONDIR (6) + ICONDIRENTRY (16) + PNG data
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // reserved
  header.writeUInt16LE(1, 2);   // type: ICO
  header.writeUInt16LE(1, 4);   // 1 image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(16, 0);      // width
  entry.writeUInt8(16, 1);      // height
  entry.writeUInt8(0, 2);       // color count
  entry.writeUInt8(0, 3);       // reserved
  entry.writeUInt16LE(1, 4);    // planes
  entry.writeUInt16LE(32, 6);   // bit count
  entry.writeUInt32LE(pngBuf.length, 8);   // size of image data
  entry.writeUInt32LE(22, 12);  // offset of image data (6 + 16)

  writeFileSync(outPath, Buffer.concat([header, entry, pngBuf]));
  console.log("  ✓", outPath.split("/public/")[1]);
}

console.log("\nGenerating SikshaWallah favicons…");

await makePng(capSvgSmall(32),  join(publicDir, "favicon-32x32.png"));
await makePng(capSvgSmall(16),  join(publicDir, "favicon-16x16.png"));
await makePng(capSvg(512),      join(publicDir, "icon-512.png"));
await makePng(capSvg(192),      join(publicDir, "icon-192.png"));
await makePng(appleSvg(),       join(publicDir, "apple-touch-icon.png"));
await makeIco(capSvgSmall(16),  join(publicDir, "favicon.ico"));

console.log("\nAll favicon files generated successfully.\n");
