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
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserLogin",
      },
    ],
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
