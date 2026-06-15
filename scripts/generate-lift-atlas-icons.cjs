/**
 * Derives the Lift Atlas splash / Android adaptive / favicon assets from the
 * canonical app icon (assets/images/lift-atlas-icon.png), which is the uploaded
 * Lift Atlas mark. Splash + favicon are direct rescales of the full icon; the
 * adaptive foreground and monochrome isolate the gold marks onto transparency so
 * every channel matches the canonical icon.
 *
 * Run: npm install --no-save sharp && node scripts/generate-lift-atlas-icons.cjs
 * Build-time art generator; not imported by the app.
 */
const path = require('path');
const sharp = require('sharp');

const IMG = path.resolve(__dirname, '..', 'assets', 'images');
const SRC = path.join(IMG, 'lift-atlas-icon.png');
const THRESHOLD = 132; // luminance cutoff isolating the bright gold mark from the dark topo field
const CROP = 84; // trim the rounded-frame bevel before isolating the mark
const INNER = 760; // content size inside the 1024 adaptive safe zone
const CANVAS = 1024;
const PAD = Math.round((CANVAS - INNER) / 2);

async function run() {
  // Splash logo and favicon are direct rescales of the canonical icon.
  await sharp(SRC).resize(CANVAS, CANVAS).png().toFile(path.join(IMG, 'lift-atlas-splash.png'));
  await sharp(SRC).resize(48, 48).png().toFile(path.join(IMG, 'lift-atlas-favicon.png'));

  // Normalize to 1024 then crop the frame bevel so only the mark remains.
  const base = await sharp(SRC).resize(CANVAS, CANVAS).png().toBuffer();
  const cropped = () =>
    sharp(base)
      .extract({ left: CROP, top: CROP, width: CANVAS - CROP * 2, height: CANVAS - CROP * 2 })
      .resize(INNER, INNER);

  const maskAlpha = await cropped()
    .greyscale()
    .toColourspace('b-w')
    .blur(0.4)
    .threshold(THRESHOLD)
    .raw()
    .toBuffer();

  const sourceRgb = await cropped().removeAlpha().raw().toBuffer();

  const foregroundInner = await sharp(sourceRgb, { raw: { width: INNER, height: INNER, channels: 3 } })
    .joinChannel(maskAlpha, { raw: { width: INNER, height: INNER, channels: 1 } })
    .png()
    .toBuffer();
  await sharp(foregroundInner)
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG, 'lift-atlas-adaptive-foreground.png'));

  const monochromeInner = await sharp({
    create: { width: INNER, height: INNER, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .joinChannel(maskAlpha, { raw: { width: INNER, height: INNER, channels: 1 } })
    .png()
    .toBuffer();
  await sharp(monochromeInner)
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(IMG, 'lift-atlas-adaptive-monochrome.png'));

  console.log('Derived splash, favicon, adaptive foreground, and monochrome from', path.basename(SRC));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
