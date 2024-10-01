#!/usr/bin/env node
import { WebSocket, WebSocketServer } from "ws";
import http from "node:http";
import readline from "node:readline";

const PORT = 3000;

const clients = [];

function createServer() {
  // const server = http.createServer((req, res) => {
  //   res.writeHead(200, { "Content-Type": "text/plain" });
  //   res.end("Websocket server running");
  // });
  //
  const connections = new Map();

  const wss = new WebSocketServer({
    port: PORT,
  });

  wss.on("connection", function connection(ws, request, client) {
    // Initial Connection
    const clientId = Date.now().toString();
    connections.set(clientId, ws);
    console.log(`connection from client: ${clientId} `);

    // Attach message event listener to this specific client connection
    ws.on("message", function message(data) {
      console.log(`Received message ${data} from client ${clientId}`);
    });

    // Send a welcome message to the client
    ws.send("Welcome to the server!");
  });
}

async function createClient() {
  const serverUrl = `ws://localhost:${PORT}`;
  const wsClient = new WebSocket(serverUrl);
  wsClient.on("open", function () {
    console.log(`connected to ws server: ${serverUrl}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }

  while (true) {
    const message = await askQuestion("type a message: ");
    console.log("message was: ", message);
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(message);
      console.log("Sent to server: " + message);
    } else {
      console.log("Connection is not open. Message not sent.");
    }
  }
}

(function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "start": {
      console.log("connect to server");
      createServer();
      break;
    }

    case "connect": {
      console.log("connect to client");
      createClient();
      break;
    }
    default: {
      break;
    }
  }
})();
