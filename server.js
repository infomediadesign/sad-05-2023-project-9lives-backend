//===================IMPORTS=======================//
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const db = require("./db");
const http = require("http");
const socketIO = require("socket.io");

//===================CONFIGS=======================//
dotenv.config();
const server = http.createServer(app);
const io = socketIO(server);

//===================WEB SOCKETS=======================//
io.on("connection", (socket) => {
  console.log("A client connected on socket");

  // Event handling
  socket.on("chat message", (message) => {
    console.log("Received message:", message);
    // Broadcast the message to all connected clients
    io.emit("chat message", message);
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

//===================SERVER=======================//
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Backend server is up and running!");
  db.createConnections(process.env.MONGO_URI);
});
