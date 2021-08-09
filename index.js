require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// Config environment
const express = require("express"); // Import express
const fs = require("fs");
const path = require("path");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express(); // Make express app

// CORS
app.use(cors());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attact
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 100,
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Use helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

/* istanbul ignore next */
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(morgan("dev"));
} else {
  // create a write stream (in append mode)
  let accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
      flags: "a",
    }
  );

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
}

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

/* Use the routes */
app.use("/auth", auth);
app.use("/movies", movies);
app.use("/", reviews);
app.use("/users", users);

/* If route not found */
app.all("*", (req, res, next) => {
  try {
    next({ message: "Endpoint not found", statusCode: 404 });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
});

/* Use error handler */
app.use(errorHandler);

/* Run the server */
/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log(`Server running on 3000`));
}

module.exports = app;
