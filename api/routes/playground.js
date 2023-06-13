const router = require("express").Router();
const GameRoom = require("../models/gameRoom");
const { generateGameId } = require("../../logic/roomIDGen");
const checkToken = require("../middleware/check-auth");

router.get("/:roomID", checkToken, async (req, res, next) => {
  const userID = req.userData.id;
  try {
    const room = await GameRoom.findOne({ roomID: req.params.roomID }).exec();
    if (!room) {
      res.status(401).json("Bad request parameters");
    } else {
      res.status(200).json({ roomDetails: room });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
