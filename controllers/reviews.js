// Amri's Code
const { review, user, movie } = require("../models");

class Reviews {
  async getAllReviews(req, res, next) {
    try {
      let data = await review
        .find()
        .populate("movie_id", "title")
        .populate("user_id", ["photo", "username"]);

      if (data.length === 0) {
        return next({ message: "Reviews not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

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

      let data = await review.findById(req.params.id);

      await review.updateOne({ _id: req.params.id }, req.body);

      // If success
      await data.save();
      return res.status(201).json({ message: "Review has been updated" });
    } catch (error) {
      next(error);
    }
  }

  // Delete review
  async deleteReview(req, res, next) {
    try {
      const data = await review.findById(req.params.id);

      if (data.n === 0) {
        return next({ message: "Review not found", statusCode: 404 });
      }

      await data.remove();
      res.status(200).json({ message: "Review has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Reviews();
