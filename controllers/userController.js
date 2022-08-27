const User = require("../models/User");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendMail = require("./emailController");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

//user register
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file.path;

    if (!name || !email || !password) {
      res.status(400).json({ msg: "Please enter all fields" });
    } else {
      const user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ msg: "User already exists" });
      } else {
        // Create salt and hash
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
          name: name,
          email: email,
          password: hash,
          image: image,
        });
        //saving data to the database and sending user data as json
        const data = await newUser.save();
        res.json(data);
      }
    }
  } catch (err) {
    err;
    res.json(err);
  }
};

//user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (user) {
      await bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const token = sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            SECRET_KEY
          );
          res.json({
            message: "success",
            token,
            user,
          });
        } else {
          res.json({ err: "Given Credentials doesn't match" });
        }
      });
    } else {
      res.json({ err: "Given Credentials doesn't match" });
    }
  } catch (err) {
    res.json(err);
  }
};

//verify user
const getUser = async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else {
      res.json({ error: "error" });
    }
  } catch (err) {
    err;
  }
};

//update user profile--User
const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    let image;
    if (req.body.image) {
      image = req.body.image;
    } else {
      image = req.file.path;
    }
    await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        name: name,
        email: email,
        image: image,
      }
    );

    res.json({ success: true });
  } catch (err) {
    err;
    res.json(err);
  }
};

//change password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body.values;

    const user = await User.findById({ _id: req.body.values.id }).select(
      "+password"
    );
    if (user) {
      await bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (match) {
          if (oldPassword === newPassword) {
            return res.json({
              success: false,
              error: "New Password cannot be old Password",
            });
          }
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(newPassword, salt);
          await User.findByIdAndUpdate(
            { _id: req.body.values.id },
            {
              password: hash,
            }
          );
          res.json({ success: true });
        } else {
          res.json({ success: false, error: "Enter Correct Password" });
        }
      });
    } else {
      res.json({ success: false, error: "Enter Correct Password" });
    }
  } catch (error) {
    res.json({ success: false, error: "Enter Correct Password" });
  }
};

//forgot password--sending email link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body.values;
    email;
    const user = await User.findOne({ email }).select("+password");
    user;

    if (user) {
      //user exists and create a one time link valid for 2 minutes
      const token = user.password + SECRET_KEY;
      const link = `${process.env.BASE_URL}/passwordreset/${user.id}/${token}`;
      await sendMail(user.email, "Password Reset", link);
      res.json({
        success: true,
        message: "Password reset link sent to your email",
      });
    } else {
      res.json({ success: false, error: "NO SUCH USER EXISTS" });
    }
  } catch (error) {
    res.json({ success: false, error: "An error occured" });
  }
};

//forgot password--handling provided password
const handleForgotPassword = async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (user) {
      const token = user.password + SECRET_KEY;
      if (token === req.params.token) {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          await User.findByIdAndUpdate(
            { _id: req.params.id },
            {
              password: hash,
            }
          );
        }
      } else {
        return res.json({ success: false, message: "Inavlid link or expired" });
      }

      res.json({ success: true, message: "Password Updated Successfully" });
    } else {
      res.json({ success: false, error: "NO SUCH USER EXISTS" });
    }
  } catch (error) {}
};

//getsingleuser--Admin
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//get all users-Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

//update user--Admin
const updateUserAdmin = async (req, res) => {
  try {
    req.body.values;
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndUpdate(req.params.id, req.body.values);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "No such user exists" });
    }
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

const deleteuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "No such user exists" });
    }
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
  changePassword,
  forgotPassword,
  getAllUsers,
  getSingleUser,
  updateUserAdmin,
  handleForgotPassword,
  deleteuser,
};
