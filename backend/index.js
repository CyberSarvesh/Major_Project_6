const express = require("express");
const http = require("http");
const SerialManager = require("./serialManager");
const initSocket = require("./socketManager");
const CommandQueue = require("./commandQueue");

// 1. Initialize the App
const app = express();
const server = http.createServer(app);
const queue = new CommandQueue();

// 2. Identify the Shrike Lite (Change 'COM3' to your actual port!)
const shrikeSerial = new SerialManager("COM3");

async function start() {
  try {
    // Connect to the hardware
    await shrikeSerial.open();
    console.log("--- SUCCESS: Shrike Lite Connected ---");

    // Start the WebSocket "Voice"
    initSocket(server, (pathData) => {
      console.log(`Received ${pathData.length} points from Frontend`);
      pathData.forEach((p) => queue.add(`X${p.x}Y${p.y}Z${p.z}`));
      processNext();
    });

    // The "Handshake": Wait for the robot to say "READY"
    shrikeSerial.onData((data) => {
      if (data.includes("READY")) {
        console.log("Robot finished move. Sending next...");
        queue.isProcessing = false;
        processNext();
      }
    });

    // Start the Express server
    server.listen(5000, () =>
      console.log("Backend live at http://localhost:5000")
    );
  } catch (e) {
    console.log("--- ERROR: Shrike Lite not found! ---");
    console.log(
      "Make sure it is plugged in and index.js has the right COM port."
    );
  }
}

// Logic to send commands one-by-one
function processNext() {
  if (queue.isEmpty() || queue.isProcessing) return;
  queue.isProcessing = true;
  shrikeSerial.write(queue.getNext());
}

start();
