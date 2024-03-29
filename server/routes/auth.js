const router = require("express").Router();
const User = require("../userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

// register
router.post("/register", async (req, res) => {
  try {
    // hash password
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(
      req.body.password.toString(),
      salt
    );

    // create user data
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    user.save();

    return res.status(200).json({ status: "success", msg: user });
  } catch (err) {
    console.log(err);
  }
});

// login
router.get("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res
        .status(404)
        .json("Couldn't find any user with this email and password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      res
        .status(400)
        .json("Couldn't find any user with this email and password");

    const token = jwt.sign(user, process.env.JWT_SECRET_KEY)

    res.status(200).json({
      status: "success",
      token,
      data: {
        user
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
