const mongoose = require("mongoose");

const gameRoomSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserLogin",
      },
    ],
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "gameroom" }
);

const roomdb = mongoose.connection.useDb("roomdb");
const GameRoom = roomdb.model("GameRoom", gameRoomSchema);

module.exports = GameRoom;
