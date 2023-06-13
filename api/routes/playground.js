const router = require("express").Router();
const GameRoom = require("../models/gameRoom");
const { generateGameId } = require("../../logic/roomIDGen");
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

router.delete("/room/delete", checkToken, async (req, res, next) => {
  try {
    const room = await GameRoom.findOne({ owner: req.userData.email }).exec();
    if (!!room) {
      await GameRoom.findByIdAndDelete(room._id);
    }
    res.status(200).json({
      roomDetails: { players: [], setting: {} },
      message: "room deleted",
    });
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
    } else if (
      room.players.filter((player) => player.id === req.userData.id).length ===
      0
    ) {
      const updatedRoom = await GameRoom.findByIdAndUpdate(
        room._id,
        {
          players: [
            ...room.players,
            { id: req.userData.id, gamerTag: req.body.playerName },
          ],
        },
        { new: true }
      );
      if (
        updatedRoom._doc.players.filter(
          (player) => player.id === req.userData.id
        ).length !== 0
      ) {
        // players is array of objects
        res.status(200).json({ roomDetails: updatedRoom._doc, isUserIn: true });
      } else
        res
          .status(200)
          .json({ roomDetails: updatedRoom._doc, isUserIn: false });
    } else res.status(200).json({ roomDetails: room._doc, isUserIn: true });
  } catch (error) {
    console.log(error.message);
  }
});

router.patch("/room/leave", checkToken, async (req, res, next) => {
  try {
    const room = await GameRoom.findOne({ roomID: req.body.gameID }).exec();
    if (!room) {
      res.status(401).json("Room does not exists");
    } else if (
      room.players.filter((player) => player.id === req.userData.id).length !==
      0
    ) {
      const updatedRoom = await GameRoom.findByIdAndUpdate(
        room._id,
        {
          players: [
            ...room.players.filter((player) => player.id !== req.userData.id),
          ],
        },
        { new: true }
      );
      if (
        updatedRoom._doc.players.filter(
          (player) => player.id === req.userData.id
        ).length !== 0
      ) {
        // players is array of objects
        res.status(200).json({ roomDetails: updatedRoom._doc, isUserIn: true });
      } else
        res
          .status(200)
          .json({ roomDetails: updatedRoom._doc, isUserIn: false });
    } else res.status(200).json({ roomDetails: room._doc, isUserIn: true });
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
