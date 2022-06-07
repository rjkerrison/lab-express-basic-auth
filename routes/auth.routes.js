const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// SignUp route
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    //Checking if username already exist
    const isUsernameExists = await User.findOne({ username });
    if (isUsernameExists) {
      res.status(400).json({ message: `Username already exists` });
      return;
    }

    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json({ createdUser });

    // Checking for errors
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
