const mongoose = require("mongoose");

const userDetailSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, ref: "UserLogin" },
  email: { type: String, required: true, unique: true },
  username: String,
  friends: [
    {
      friendID: { type: mongoose.Schema.Types.ObjectId, ref: "UserLogin" },
      name: String,
    },
  ],
  recents: [{ players: [String] }],
}, {collection: "user-details"});

const UsersDB = mongoose.connection.useDb("usersdb");

module.exports = UsersDB.model("UserDetails", userDetailSchema);
