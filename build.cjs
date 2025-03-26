const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "dist");
const config = path.join(__dirname, "package.json");
const readmePath = path.join(__dirname, "README.md");

exec("npx tsc", (err, stdout, stderr) => {
  if (err) {
    console.error(`Exec error: ${err}`);
    return;
  }

  const jsPath = path.join(dist, "acvx.js");
  const cjsPath = path.join(dist, "acvx.cjs");

  fs.copyFileSync(jsPath, cjsPath);

  const esModuleExport = "\nexport { ax, av };";
  fs.appendFileSync(jsPath, esModuleExport, "utf8");

  const cjsModuleExport = "\nmodule.exports = { ax, av };";
  fs.appendFileSync(cjsPath, cjsModuleExport, "utf8");

  fs.copyFileSync(config, path.join(dist, "package.json"));
  fs.copyFileSync(readmePath, path.join(dist, "README.md"));

  minifyFile(jsPath);
  minifyFile(cjsPath);

  console.log("[✨] Files compiled and copied");
});

function minifyFile(filePath) {
  exec(`npx terser ${filePath} --compress --mangle --output ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error minifying ${filePath}: ${err}`);
      return;
    }
    console.log(`[⚒️] Minified ${path.basename(filePath)}`);

    const stats = fs.statSync(filePath);
    const humanReadableSize = formatBytes(stats.size);

    console.log(`[📁] File size of ${path.basename(filePath)}: ${humanReadableSize}`);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} bytes`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}
