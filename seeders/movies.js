/* // Bayu's Code
const { movie } = require("../models");

// Seeder add
exports.addMovies = async () => {
  for (let i = 0; i < 2; i++) {
    await movie.create({
      title: "Enola Holmes",
      genres: "action",
      release_year: "2020",
      poster: "/adsfdsafsd  ",
      trailer: "https://youtu.be/1d0Zf9sXlHk",
      synopsis:
        "While searching for her missing mother, intrepid teen Enola Holmes uses her sleuthing skills to outsmart big brother Sherlock and help a runaway lord.",
      rating: "0",
      comment: [],
    });
  }

  console.log("Successfully add movie");
};

// Seeder undo
exports.deleteMovies = async () => {
  await movie.remove();

  console.log("Movie has been deleted");
};
 */
