const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


// =======================
// SIGNUP ROUTE
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup request:", req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
    });
  }
});


// =======================
// LOGIN ROUTE
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request body:", req.body);

    // find user
    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
    });
  }
});


// =======================
module.exports = router;