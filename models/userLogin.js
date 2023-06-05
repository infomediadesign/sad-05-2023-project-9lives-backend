const mongoose = require("mongoose");

const loginSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("UserLogin", loginSchema);
