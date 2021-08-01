// Adib's Code
const { deleteMovie } = require("../controllers/movies");
const { addMovies, deleteMovies } = require("./movies");

async function add() {
  await Promise.all([addMovies()]);
}

async function remove() {
  await Promise.all([deleteMovie()]);
}

if (process.argv[2] === "add") {
  add().then(() => {
    console.log("Seeders success");
    process.exit(0);
  });
} else if (process.argv[2] === "remove") {
  remove().then(() => {
    console.log("Delete data success");
    process.exit(0);
  });
}
