// Bayu's Code
const { movie, review } = require("../models");

class Movie {
  async createMovie(req, res, next) {
    try {
      req.body.genres = req.body.genres.split(", ");
      const newMovie = await movie.create(req.body);

      const dataMovie = await movie
        .findOne({ _id: newMovie._id })
        .populate("review");

      res.status(201).json({ message: "Successfully created movie" });
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

      res.status(200).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getDetailMovie(req, res, next) {
    try {
      const pageReview = req.query.revpage;
      const limitReview = parseInt(req.query.revlimit) || 0;
      const skipReview = pageReview > 0 ? (pageReview - 1) * limitReview : 0;

      const reviewData = await review
        .find({ movie_id: req.params.id })
        .limit(limitReview)
        .skip(skipReview)
        .sort("-createdAt");

      let data = await movie.findById(req.params.id);
      data.reviews.push(...reviewData);

      if (!data) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getMovieByTitle(req, res, next) {
    try {
      const getTitle = req.query.title;
      const pageSize = parseInt(req.query.limit) || 15;
      const currentPage = req.query.page;
      const regex = new RegExp(getTitle, "i");

      const dataMovie = await movie
        .find({ title: { $regex: regex } })
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

      if (dataMovie.length === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getMovieByGenre(req, res, next) {
    try {
      const getGenre = req.params.genres;
      const pageSize = parseInt(req.query.limit) || 15;
      const currentPage = req.query.page;

      const dataMovie = await movie
        .find({ genres: getGenre })
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

      if (dataMovie.length === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ dataMovie });
    } catch (error) {
      next(error);
    }
  }

  async getMoviePagination(req, res, next) {
    try {
      const pageSize = parseInt(req.query.limit) || 15;
      const currentPage = req.query.page;

      const dataMovie = await movie
        .find()
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

      if (dataMovie.length === 0) {
        return next({ message: "Movie not found", statusCode: 404 });
      }

      res.status(200).json({ dataMovie });
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

      return res.status(201).json({ message: "Successfully updated movie" });
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      const dataMovie = await movie.deleteById({ _id: req.params.id });

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
