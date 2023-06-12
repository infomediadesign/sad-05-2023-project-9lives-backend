const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema(
  {
    roomID: {
      type: String,
      required: true,
      unique: true,
    },
    gameType: {
      type: String,
    },
    players: [
      {
        id: {
          type: String,
          required: true,
        },
        gamerTag: { type: String, required: true },
        score: { type: Number, default: 0 },
      },
    ],
    setting: {
      maxPlayers: { type: Number, default: 2, required: true },
      rounds: { type: Number, default: 1, required: true },
    },
    currentRound: { type: Number, default: 1, required: true },
    owner: { type: String, required: true },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "gameroom" }
);

const roomdb = mongoose.connection.useDb("roomdb");
module.exports = roomdb.model("GameRoom", gameRoomSchema);
