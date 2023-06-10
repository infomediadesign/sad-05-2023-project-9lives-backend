const router = require("express").Router();
const GameRoom = require("../models/gameRoom");
const { generateRandomString } = require("../../logic/room");
const { default: mongoose } = require("mongoose");
const checkToken = require("../middleware/check-auth");

router.get("/movie/choice", (req, res, next) => {
  res.status(200).json({
    movie: ["detective pikachu", "batman", "avengers"],
  });
});

router.post("/room/create", checkToken, (req, res, next) => {
  const gameId = generateRandomString(8);
  console.log(gameId);
  res.status(200).json({ gameId: gameId });
});

router.patch("/room/join", checkToken, async (req, res, next) => {
  try {
    const room = await GameRoom.findOne({ roomID: req.body.gameID }).exec();
    if (!room) {
      res.status(401).json("Room does not exists");
    } else {
      const updatedRoom = await GameRoom.findByIdAndUpdate(
        room._id,
        {
          players: [
            ...room.players,
            new mongoose.Types.ObjectId(req.body.userID),
          ],
        },
        { new: true }
      );
      if (updatedRoom._doc.players.includes(req.body.userID)) {
        res.status(200).json({ room: updatedRoom._doc, isUserIn: true });
      } else res.status(200).json({ room: updatedRoom._doc, isUserIn: false });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
