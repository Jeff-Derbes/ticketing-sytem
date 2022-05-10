const asyncHandler = require("express-async-handler");
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User model for db
const User = require("../models/userModel");

// @desc register a new user
// @route /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  //Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //Hash pass
  const salt = await bcyrpt.genSalt(10);
  const hashedPassword = await bcyrpt.hash(password, salt);

  //create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    token: generateToken(user._id),
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc login user
// @route /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  //Check user and pass
  if (user && (await bcyrpt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.send("Login Route");
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
};
