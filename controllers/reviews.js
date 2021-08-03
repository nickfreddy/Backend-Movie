// Amri's Code
const { review, user, movie } = require("../models");

class Reviews {
  // async getAllReviews(req, res, next) {
  //   try {
  //     let data = await review.find().populate("movie");

  //     if (data.length === 0) {
  //       return next({ message: "Reviews not found", statusCode: 404 });
  //     }

  //     for (let i = 0; i < data.length; i++) {
  //       data[i].movie = await movie.findOne({
  //         _id: data[i].movie,
  //       });
  //     }

  //     res.status(200).json({ data });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async getDetailReview(req, res, next) {
  //   try {
  //     let data = await review.findOne({ _id: req.params.id }).populate("movie");

  //     if (!data) {
  //       return next({ message: "Review not found", statusCode: 404 });
  //     }

  //     data.movie = await user.findOne({ _id: data.movie });

  //     res.status(200).json({ data });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async createReview(req, res, next) {
    try {
      // Create review
      req.body.user_id = req.user.user;
      req.body.movie_id = req.params.movie_id;
      await review.create(req.body);

      res.status(201).json({ message: "review has been submitted" });
    } catch (error) {
      next(error);
    }
  }

  // Update review
  async updateReview(req, res, next) {
    try {
      // Update data
      req.body.user_id = req.user.user;
      req.body.movie_id = req.params.movie_id;

      let data = await review.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
        }
      );
      // new is to return the updated review data
      // If no new, it will return the old data before updated

      // If success
      return res.status(201).json({ message: "Review has been updated" });
    } catch (error) {
      next(error);
    }
  }

  // Delete review
  async deleteReview(req, res, next) {
    try {
      const data = await review.findByIdAndDelete({ _id: req.params.id });

      if (data.n === 0) {
        return next({ message: "Review not found", statusCode: 404 });
      }

      res.status(200).json({ message: "Review has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Reviews();
