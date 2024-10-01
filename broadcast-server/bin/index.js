#!/usr/bin/env node
import { WebSocket, WebSocketServer } from "ws";
import readline from "node:readline";

const PORT = 3000;

function createServer() {
  const wss = new WebSocketServer({
    port: PORT,
  });

  console.log("Created Web Socket Server on port: " + PORT);

  wss.on("connection", function connection(ws, request, client) {
    // Initial Connection
    const clientId = Date.now().toString();
    console.log(`Connection from client: ${clientId} `);

    // Attach message event listener to this specific client connection
    ws.on("message", function message(data, isBinary) {
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });

    ws.on("close", function close() {
      console.log(`client: ${clientId} disconnected`);
    });
  });
}

async function createClient() {
  const serverUrl = `ws://localhost:${PORT}`;
  const wsClient = new WebSocket(serverUrl);
  wsClient.on("open", async function () {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    function askQuestion(query) {
      return new Promise((resolve) => rl.question(query, resolve));
    }

    while (true) {
      const message = await askQuestion("Enter a Message: ");
      if (wsClient.readyState === WebSocket.OPEN) {
        wsClient.send(message);
      } else {
        console.log("Connection is not open. Message not sent.");
      }
    }
  });

  wsClient.on("message", function message(data) {
    console.log("\nBroadcasted Message: %s\n", data);
  });

  wsClient.on("close", function close() {
    console.log("Server Error: Disconnected");
    process.exit(0);
  });
}

(function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "start": {
      createServer();
      break;
    }

    case "connect": {
      createClient();
      break;
    }
    default: {
      break;
    }
  }
})();
