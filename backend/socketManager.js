// socketManager.js
const { Server } = require("socket.io");

function initSocket(server, onCommandReceived) {
  const io = new Server(server, {
    cors: { origin: "*" }, // Allows the frontend to talk to this backend
  });

  io.on("connection", (socket) => {
    console.log("Frontend User Connected! ID:", socket.id);

    // When teammate sends a path, we add it to our logic
    socket.on("SEND_PATH", (pathData) => {
      // pathData is an array of coordinates: [{x:10, y:20}, {x:12, y:21}...]
      onCommandReceived(pathData);
    });

    socket.on("disconnect", () => console.log("User Disconnected"));
  });

  return io;
}

module.exports = initSocket;
