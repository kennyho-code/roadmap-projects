#!/usr/bin/env node

const http = require("node:http");
const https = require("node:https");

const cache = new Map();

function bootupServer(port, url) {
  const server = http.createServer((clientReq, clientRes) => {
    const hostname = new URL(url).hostname;
    const options = {
      hostname,
      port: 443,
      path: clientReq.url,
      method: clientReq.method,
    };

    const key = hostname + clientReq.url;

    if (cache.has(key)) {
      console.log("HIT CACHED!");
      const cachedResponse = cache.get(key);
      clientRes.writeHead(cachedResponse.statusCode, {
        ...cachedResponse.headers,
        "X-Cache": "HIT",
      });

      clientRes.end(cachedResponse.body);
    } else {
      const proxyReq = https.request(options, (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, {
          ...proxyRes.headers,
          "X-Cache": "MISS",
        });
        let body = "";
        proxyRes.on("data", (chunk) => {
          body += chunk;
        });

        proxyRes.on("end", () => {
          cache.set(key, {
            statusCode: proxyRes.statusCode,
            headers: { ...proxyRes.headers },
            body: body,
          });

          clientRes.end(body);
        });
      });
      clientReq.pipe(proxyReq, { end: true });
    }
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
