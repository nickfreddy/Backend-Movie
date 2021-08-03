require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
}); // Config environment
const express = require("express"); // Import express
const fileUpload = require("express-fileupload");

const app = express(); // Make express app

/* Import routes */
const auth = require("./routes/auth");
const movies = require("./routes/movies");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

/* Import errorHander */
const errorHandler = require("./middlewares/errorHandler");

/* Enables req.body */
app.use(express.json()); // Enables req.body (JSON)
// Enables req.body (url-encoded)
app.use(
  express.urlencoded({
    extended: true,
  })
);

/* Enable req.body and req.files (form-data) */
// app.use(fileUpload());

/* Make public folder for static file */
app.use(express.static("public"));

// DELETE THIS BEFORE DEPLOYING
app.get("/", (req, res) => {
  res.send("THIS IS HOME PAGE");
});

/* Use the routes */
app.use("/auth", auth);
app.use("/movies", movies);
app.use("/movies/:movie_id/reviews", reviews);
app.use("/users", users);

/* If route not found */
app.all("*", (req, res, next) => {
  try {
    next({ message: "Endpoint not found", statusCode: 404 });
  } catch (error) {
    next(error);
  }
});

/* Use error handler */
app.use(errorHandler);

/* Run the server */
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log(`Server running on 3000`));
}

module.exports = app;
