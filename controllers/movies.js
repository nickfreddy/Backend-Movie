// Bayu's Code
const { movie, review } = require("../models");

class Movie {
  async createMovie(req, res, next) {
    try {
      const newMovie = await movie.create(req.body);

      const dataMovie = await movie
        .findOne({ _id: newMovie._id })
        .populate("review");

      res.status(201).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getAllMovie(req, res, next) {
    try {
      const dataMovie = await movie.find();

      if (dataMovie.length === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      for (let i = 0; i < dataMovie.length; i++) {
        dataMovie[i].review = await review.findOne({
          _id: dataMovie[i].review,
        });
      }

      res.status(200).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getDetailMovie(req, res, next) {
    try {
      const dataMovie = await movie
        .findOne({ _id: req.params.id })
        .populate("review");

      if (!dataMovie) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      dataMovie.review = await review.findOne({ _id: dataMovie.review });

      res.status(200).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getMovieByCategory(req, res, next) {
    try {
      const movieCategory = await movie.find({ category: req.params.genres });

      if (!movieCategory) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ movieCategory });
    } catch (error) {
      next(error);
    }
  }

  async updateMovie(req, res, next) {
    try {
      let dataMovie = await movie
        .findOneAndUpdate(
          {
            _id: req.params.id,
          },
          req.body,
          {
            new: true,
          }
        )
        .populate("review");

      if (!dataMovie) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      dataMovie.review = await review.findOne({ _id: dataMovie.review });

      return res.status(201).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      const dataMovie = await movie.delete({ _id: req.params.id });

      if (dataMovie.n === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ message: "Movie has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Movie();
