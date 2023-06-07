const router = require("express").Router();
const UserLogin = require("../models/userLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  let isPassMatch = false;
  const user = await UserLogin.findOne({ email: req.body.email }).exec();
  isPassMatch = bcrypt.compareSync(req.body.password, user.password);
  res.status(200).json({ m: isPassMatch });
});

module.exports = router;
