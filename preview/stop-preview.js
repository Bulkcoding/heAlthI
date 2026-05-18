const fs = require("node:fs");
const path = require("node:path");

const previewDir = __dirname;
const pidFiles = [".server-pid", ".tunnel-pid"];

for (const fileName of pidFiles) {
  const filePath = path.join(previewDir, fileName);
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const pid = Number(fs.readFileSync(filePath, "utf8").trim());
  if (Number.isFinite(pid)) {
    try {
      process.kill(pid);
    } catch (_error) {
      // Ignore stale pid files.
    }
  }

  fs.unlinkSync(filePath);
}

console.log("Preview processes stopped");
