const router = require("express").Router();
const {generateRandomString} = require('../../logic/room')

router.get("/movie/choice", (req, res, next) => {
  res.status(200).json({
    movie: ["detective pikachu", "batman", "avengers"],
  });
});

router.post("/room/create", (req, res, next) => {
  const gameId = generateRandomString(8);
  console.log(gameId);
  res.status(200).json(gameId);
});

router.patch("/room/join", (req, res, next) => {
  res.status(200).json("welcome to the room");
});

module.exports = router;
