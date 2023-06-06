//===================IMPORTS=======================//
const express = require("express");
const cors = require("cors");
const loginRoutes = require("./api/routes/login");
const playground = require("./api/routes/playground");

//===================CONFIGS=======================//
const app = express();
app.use(express.json());
app.use(cors());

//===================ROUTES=======================//
app.get("/", (req, res, next) => {
  res.json({ message: "It works" });
});

// app.use("/api/auth", authRoute);
app.use("/api/login", loginRoutes);
app.use("/play", playground);

module.exports = app;
