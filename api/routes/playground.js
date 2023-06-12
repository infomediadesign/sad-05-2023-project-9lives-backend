const router = require("express").Router();
const GameRoom = require("../models/gameRoom");
const { generateGameId } = require("../../logic/room");
const { default: mongoose } = require("mongoose");
const checkToken = require("../middleware/check-auth");
const { json } = require("express");

router.get("/movie/choice", (req, res, next) => {
  res.status(200).json({
    movie: ["detective pikachu", "batman", "avengers"],
  });
});

router.post("/room/create", checkToken, async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.userData);
  let gameId = await generateGameId();

  const roomData = {
    roomID: gameId,
    gameType: "Multiplayer",
    players: [{ id: req.userData.id, gamerTag: req.body.playerName, score: 0 }],
    setting: {
      maxPlayers: req.body.maxPlayers,
      rounds: req.body.rounds,
    },
    currentRound: 1,
    owner: req.userData.email,
  };

  try {
    const room = await GameRoom.findOne({ owner: req.userData.email }).exec();
    if (!!room) {
      await GameRoom.findByIdAndDelete(room._id);
    }
    const gameRoom = await GameRoom.create(roomData);

    res.status(201).json({ roomDetails: gameRoom });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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
        // players is array of objects
        res.status(200).json({ room: updatedRoom._doc, isUserIn: true });
      } else res.status(200).json({ room: updatedRoom._doc, isUserIn: false });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/room/lobby", checkToken, async (req, res, next) => {
  const userID = req.userData.id;
  try {
    const room = await GameRoom.findOne({ roomID: req.body.gameID }).exec();
    if (!room) {
      res.status(401).json("Bad request parameters");
    } else {
      if (room.players.filter((player) => player.id === userID).length !== 0) {
        res.status(200).json({ roomDetails: room });
      } else {
        res.status(401).json("Non player access denied");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
