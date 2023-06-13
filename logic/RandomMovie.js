const { default: mongoose } = require("mongoose");
const MoviesData = require("../api/models/movie");

const getRandomMovie = async () => {
  try {
    const count = await MoviesData.countDocuments().exec();
    var random = Math.floor(Math.random() * count);

    const movie = await MoviesData.findOne().skip(random).exec();
    return movie.name;
  } catch (error) {
    console.log("Error while etting random movie: ", error);
  }
};

module.exports.getRandomMovie = getRandomMovie;
