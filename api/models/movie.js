const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    "release-year": { type: Number, required: true },
  },
  { collection: "movie-details" }
);

const MoviesDB = mongoose.connection.useDb("moviesdb");

module.exports = MoviesDB.model("MoviesData", movieSchema);
