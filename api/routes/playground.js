const router = require("express").Router();

router.get("/movie/choice", (req, res, next) => {
  res.status(200).json({
    movie: ["detective pikachu", "batman", "avengers"],
  });
});

router.post("room/create", (req, res, next) => {
  res.status(200).json("room created");
});

router.patch("room/join", (req, res, next) => {
  res.status(200).json("welcome to the room");
});

module.exports = router;
