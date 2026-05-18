const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const previewDir = __dirname;
const cloudflaredFile = path.join(previewDir, "cloudflared.exe");
const tunnelLogFile = path.join(previewDir, "tunnel.log");
const tunnelPidFile = path.join(previewDir, ".tunnel-pid");

if (!fs.existsSync(cloudflaredFile)) {
  console.error("cloudflared.exe not found");
  process.exit(1);
}

for (const file of [tunnelLogFile, tunnelPidFile]) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

const logFd = fs.openSync(tunnelLogFile, "a");

const child = spawn(
  cloudflaredFile,
  ["tunnel", "--url", "http://127.0.0.1:3000"],
  {
    cwd: previewDir,
    detached: true,
    stdio: ["ignore", logFd, logFd]
  }
);

child.unref();
fs.writeFileSync(tunnelPidFile, String(child.pid));
console.log(`Tunnel launched with PID ${child.pid}`);
