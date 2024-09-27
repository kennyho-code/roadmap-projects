#!/usr/bin/env node

const http = require("node:http");
const https = require("node:https");

function bootupServer(port, url) {
  const server = http.createServer((clientReq, clientRes) => {
    const hostname = new URL(url).hostname;
    const options = {
      hostname,
      port: 443,
      path: clientReq.url,
      method: clientReq.method,
    };

    const proxyReq = https.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes, { end: true });
    });

    clientReq.pipe(proxyReq, { end: true });
  });

  server.listen(port, () => {
    console.log(`server running on http://localhost:${port}/`);
  });
}

function createArgsMap(args) {
  const argsMap = new Map();
  args.forEach((arg, idx) => {
    const isFlag = arg.includes("--");
    if (isFlag) {
      const key = arg.replace("--", "");
      const val = args[idx + 1];
      argsMap.set(key, val);
    }
  });
  return argsMap;
}

(function main() {
  const args = process.argv.slice(2);
  const argsMap = createArgsMap(args);
  const port = argsMap.get("port");
  const url = argsMap.get("origin");
  bootupServer(port, url);
})();
