const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const previewDir = __dirname;
const portFile = path.join(previewDir, ".server-port");
const logFile = path.join(previewDir, ".server-log");
const preferredPorts = [3000, 3001, 4173, 4321];

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function resolveFile(requestPath) {
  if (
    requestPath === "/" ||
    requestPath === "/planning" ||
    requestPath === "/login" ||
    requestPath === "/dashboard" ||
    requestPath === "/exercise-detail" ||
    requestPath === "/today-workout"
  ) {
    return path.join(previewDir, "index.html");
  }

  const candidate = path.join(previewDir, requestPath.replace(/^\/+/, ""));
  if (candidate.startsWith(previewDir) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  return path.join(previewDir, "index.html");
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, "http://127.0.0.1");
  const filePath = resolveFile(requestUrl.pathname);
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "text/plain; charset=utf-8";

  fs.readFile(filePath, (error, buffer) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Preview server error");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(buffer);
  });
});

function listenNext(index = 0) {
  if (index >= preferredPorts.length) {
    fs.writeFileSync(logFile, "No available port found.");
    process.exit(1);
  }

  const port = preferredPorts[index];
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      listenNext(index + 1);
      return;
    }

    fs.writeFileSync(logFile, String(error));
    process.exit(1);
  });

  server.listen(port, "127.0.0.1", () => {
    fs.writeFileSync(portFile, String(port));
    fs.writeFileSync(logFile, `STRONGER preview running on http://127.0.0.1:${port}`);
  });
}

listenNext();
