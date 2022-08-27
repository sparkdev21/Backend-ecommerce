const { verify } = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.json({ error: "error" });
    } else {
      const validToken = verify(token, SECRET_KEY);

      const user = await User.findById(validToken.id).select("-password");
      req.user = { user, token };

      next();
    }
  } catch (err) {
    res.json({ error: err, message: "failed" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user && req.user.user && req.user.user.role)) {
      return next(res.json({ success: "false", message: "Not Authorized" }));
    }
    next();
  };
};
module.exports = { auth, authorizeRoles };
