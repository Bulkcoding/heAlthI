const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const previewDir = __dirname;
const serverFile = path.join(previewDir, "server.js");
const pidFile = path.join(previewDir, ".server-pid");
const portFile = path.join(previewDir, ".server-port");
const logFile = path.join(previewDir, ".server-log");
const stdoutFile = path.join(previewDir, "stdout.log");
const stderrFile = path.join(previewDir, "stderr.log");

for (const file of [pidFile, portFile, logFile, stdoutFile, stderrFile]) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

const stdout = fs.openSync(stdoutFile, "a");
const stderr = fs.openSync(stderrFile, "a");

const child = spawn(process.execPath, [serverFile], {
  cwd: path.dirname(previewDir),
  detached: true,
  stdio: ["ignore", stdout, stderr]
});

child.unref();
fs.writeFileSync(pidFile, String(child.pid));
console.log(`Preview server launched with PID ${child.pid}`);
