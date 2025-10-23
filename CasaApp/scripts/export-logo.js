const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

(async () => {
  try {
    const svgPath = path.resolve(__dirname, "../assets/home-automation-logo.svg");
    const outPath = path.resolve(__dirname, "../assets/icon.png");

    if (!fs.existsSync(svgPath)) {
      throw new Error(`No se encontró el SVG en: ${svgPath}`);
    }

    const svgBuffer = fs.readFileSync(svgPath);

    await sharp(svgBuffer, { density: 512 })
      .resize(1024, 1024, { fit: "cover" })
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`Icono PNG generado correctamente: ${outPath}`);
  } catch (err) {
    console.error("Error al generar el PNG:", err);
    process.exit(1);
  }
})();