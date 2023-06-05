const router = require("express").Router();
const UserLogin = require("../models/userLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/login", (req, res, next) => {
  res.status(200).json({
    message: "Logged in",
  });
});
