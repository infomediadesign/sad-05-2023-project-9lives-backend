const router = require("express").Router();
const GameRoom = require("../models/gameRoom");
const { generateRandomString } = require("../../logic/room");
const { default: mongoose } = require("mongoose");

router.get("/movie/choice", (req, res, next) => {
  res.status(200).json({
    movie: ["detective pikachu", "batman", "avengers"],
  });
});

router.post("/room/create", (req, res, next) => {
  const gameId = generateRandomString(8);
  console.log(gameId);
  res.status(200).json({ gameId: gameId });
});

router.patch("/room/join", async (req, res, next) => {
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
        { new: true },
        (err) => {
          if (!err) {
            console.log("Managed to update");
            res.status(200).json({ message: "Added to the room", isUserIn: true });
          } else {
            res.status(400).json({
              message: `Something went wrong please try again => ${err}`,
              isUserIn: false,
            });
          }
        }
      );
      debugger;
      res.status(200).json(updatedRoom._doc);
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
