const crypto = require("crypto");
const GameRoom = require("../api/models/gameRoom");

const generateRandomString = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

const generateGameId = async () => {
  let gameId = generateRandomString(8);
  try {
    const room = await GameRoom.findOne({ roomID: gameId }).exec();
    if (room) {
      generateGameId();
    } else return gameId;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.generateGameId = generateGameId;
