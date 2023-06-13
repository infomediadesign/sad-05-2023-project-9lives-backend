//===================IMPORTS=======================//
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const db = require("./db");
const http = require("http");
const socketIO = require("socket.io");
const { createGame } = require("./logic/sockets/room");

//===================CONFIGS=======================//
dotenv.config();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//===================WEB SOCKETS=======================//

// Create a namespace for the game
const gameNamespace = io.of("/game");

createGame(gameNamespace);

// gameNamespace.on('connection', (socket) => {
//   console.log('A client connected to the game namespace');

//   // Join the game room
//   socket.on('join', (roomId) => {
//     socket.join(roomId);
//     console.log(`Client joined room ${roomId}`);
//   });

//   // Handle game-related events
//   socket.on('move', (roomId, moveData) => {
//     // Get the clients in the room
//     const clientsInRoom = io.of('/game').in(roomId).clients;

//     // Broadcast the move event to selected clients in the room
//     clientsInRoom.forEach((client) => {
//       if (client.id !== socket.id) {
//         client.emit('move', moveData);
//       }
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('A client disconnected from the game namespace');
//   });
// });

//===================SERVER=======================//
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("Backend server is up and running!");
  db.createConnections(process.env.MONGO_URI);
});
