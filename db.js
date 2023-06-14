const mongoose = require("mongoose");

const createConnections = (mongoURI) => {
  mongoose.connect(mongoURI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("mongo connected");
  });
};

module.exports.createConnections = createConnections;