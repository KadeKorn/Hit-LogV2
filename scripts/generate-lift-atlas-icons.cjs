/**
 * Generates the Lift Atlas app icon / splash / adaptive assets from an inline
 * SVG mark (near-black background, muted-gold compass + peak + barbell).
 *
 * Run: npm install --no-save sharp && node scripts/generate-lift-atlas-icons.cjs
 * This is a build-time art generator; it is not imported by the app.
 */
const path = require('path');
const sharp = require('sharp');

const OUT = path.resolve(__dirname, '..', 'assets', 'images');
const BG = '#0B0D10'; // near-black
const GOLD = '#C9962E'; // muted gold

function mark(color) {
  return `
    <circle cx="512" cy="512" r="316" fill="none" stroke="${color}" stroke-width="26"/>
    <polygon points="512,150 487,200 537,200" fill="${color}"/>
    <polygon points="512,372 636,596 388,596" fill="${color}"/>
    <rect x="288" y="648" width="448" height="26" rx="13" fill="${color}"/>
    <rect x="250" y="620" width="32" height="82" rx="8" fill="${color}"/>
    <rect x="742" y="620" width="32" height="82" rx="8" fill="${color}"/>
    <rect x="292" y="634" width="16" height="54" rx="5" fill="${color}"/>
    <rect x="716" y="634" width="16" height="54" rx="5" fill="${color}"/>
  `;
}

function full(bg, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="${bg}"/>${mark(color)}</svg>`;
}

function transparent(color, scale = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><g transform="translate(512 512) scale(${scale}) translate(-512 -512)">${mark(color)}</g></svg>`;
}

async function render(svg, file, size) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(OUT, file));
  console.log('wrote', file);
}

(async () => {
  await render(full(BG, GOLD), 'lift-atlas-icon.png', 1024);
  await render(transparent(GOLD), 'lift-atlas-splash.png', 1024);
  await render(transparent(GOLD, 0.66), 'lift-atlas-adaptive-foreground.png', 1024);
  await render(transparent('#FFFFFF', 0.66), 'lift-atlas-adaptive-monochrome.png', 1024);
  await render(full(BG, GOLD), 'lift-atlas-favicon.png', 48);
  console.log('Lift Atlas icons generated.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
