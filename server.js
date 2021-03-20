#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require("ws");
const http = require("http");
const wss = new WebSocket.Server({ noServer: true });
const Y = require("yjs");
const { setupWSConnection, setPersistence } = require("y-websocket/bin/utils");

const fs = require("fs/promises");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 1234;

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

setPersistence({
  bindState(docName, doc) {
    console.log("binding state", docName);

    // Debounce, save to disk
    let timeout;
    doc.on("update", () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(async () => {
        console.log("writing to file");
        await fs.writeFile(
          path.join("_content", docName),
          doc.getText("codemirror").toString()
        );
      }, 1000);
    });
  },
  writeState(docName, doc) {
    console.log("write", docName, doc.share.size);
    return Promise.resolve(doc);
  },
});

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  /**
   * @param {any} ws
   */
  const handleAuth = (ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen({ host, port });

console.log(`running at '${host}' on port ${port}`);
