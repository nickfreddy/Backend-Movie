// Adib's Code

const { user, review } = require("../models/");

class Users {
  async getAllUsers(req, res, next) {
    try {
      let data = await user.find();

      if (data.length === 0) {
        return next({ message: "Users not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getDetailUser(req, res, next) {
    try {
      const page = req.query.page;
      const limit = parseInt(req.query.limit) || 0;
      const skip = page > 0 ? (page - 1) * limit : 0;

      const reviewData = await review
        .find({ user_id: req.params.id })
        .limit(limit)
        .skip(skip);

      console.log(req.query.limit);
      let data = await user.findById(req.params.id);
      data.reviews.push(...reviewData);

      if (!data) {
        return next({ message: "User not found", statusCode: 404 });
      }

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      // Create user
      const newData = await user.create(req.body);

      // Find the user has been created
      let data = await user.findOne({ _id: newData._id });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      // Update data
      if (req.file) {
        req.body.photo = req.file.path;
      }

      let data = await user.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        {
          new: true,
        }
      );

      // new is to return the updated user data
      // If no new, it will return the old data before updated

      // If success
      // return res.status(201).json({ data });

      return res.status(201).json({
        message: `User ${data.username} detail is updated.`,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete transaksi
  async deleteUser(req, res) {
    try {
      // delete data
      let data = await user.delete({ _id: req.params.id });

      return res.status(200).json({
        message: `User ${data.username} is deleted successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Users();
