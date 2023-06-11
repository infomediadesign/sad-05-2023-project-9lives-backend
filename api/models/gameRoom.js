const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserLogin",
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
