const jwt = require("jsonwebtoken");

class User {
  async getToken(req, res, next) {
    try {
      const data = {
        user: req.user._id,
      };
      const token = jwt.sign(data, process.env.JWT_SECRET);

      res.status(200).json({ _id: req.user._id, token });
    } catch (error) {
      /* istanbul ignore next */
      next(error);
    }
  }
}

module.exports = new User();
