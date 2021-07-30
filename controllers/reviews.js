// Amri's Code
const { review, user, movie } = require("../models");

class Reviews {
  async getAllReviews(req, res, next) {
    try {
      let data = await review.find().populate("user");

      if (data.length === 0) {
        return next({ message: "Reviews not found", statusCode: 404 });
      }

      for (let i = 0; i < data.length; i++) {
        data[i].movie = await movie.findOne({
          _id: data[i].movie,
        });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailReview(req, res, next) {
    try {
      let data = await review.findOne({ _id: req.params.id }).populate("user");

      if (!data) {
        return next({ message: "Review not found", statusCode: 404 });
      }

      data.movie = await user.findOne({ _id: data.movie });

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req, res, next) {
    try {
      // Create review
      const newData = await review.create(req.body);

      // Find the review has been created
      let data = await review.findOne({ _id: newData._id }).populate("user");

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  // Update review
  async updateReview(req, res) {
    try {
      // Update data
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
      return res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  // Delete review
  async deleteReview(req, res) {
    try {
      // delete data
      await review.delete({ _id: req.params.id });

      return res.status(200).json({
        message: `Delete successful for review ${req.params.id}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Reviews();
