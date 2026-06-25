// Gera ícones do site a partir do emblema da Eucalipto.
// app/icon.png + app/apple-icon.png (convenção Next.js) e app/favicon.ico (PNG embutido em ICO).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'logo-emblem.webp');
const APP = path.join(__dirname, '..', 'app');
const BG = { r: 0x14, g: 0x30, b: 0x1e, alpha: 1 }; // verde da marca

// emblema quadrado, sem corte (contain sobre o verde da marca)
function squarePng(size) {
  return sharp(SRC)
    .resize(size, size, { fit: 'contain', background: BG })
    .flatten({ background: BG }) // remove transparência, preenche com verde
    .ensureAlpha()               // re-adiciona canal alfa => PNG RGBA (exigido pelo decoder de ICO do Next)
    .png()
    .toBuffer();
}

function wrapIco(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type = icon
  header.writeUInt16LE(1, 4);      // count = 1
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2);          // palette
  entry.writeUInt8(0, 3);          // reserved
  entry.writeUInt16LE(1, 4);       // planes
  entry.writeUInt16LE(32, 6);      // bpp
  entry.writeUInt32LE(pngBuffer.length, 8); // size of png
  entry.writeUInt32LE(6 + 16, 12); // offset
  return Buffer.concat([header, entry, pngBuffer]);
}

(async () => {
  const icon = await squarePng(512);
  fs.writeFileSync(path.join(APP, 'icon.png'), icon);

  const apple = await squarePng(180);
  fs.writeFileSync(path.join(APP, 'apple-icon.png'), apple);

  const ico48 = await squarePng(48);
  fs.writeFileSync(path.join(APP, 'favicon.ico'), wrapIco(ico48, 48));

  console.log('OK: app/icon.png (512), app/apple-icon.png (180), app/favicon.ico (48)');
})().catch((e) => { console.error(e); process.exit(1); });
