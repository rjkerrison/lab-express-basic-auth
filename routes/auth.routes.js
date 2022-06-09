const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { exists } = require("../models/User.model");
const User = require("../models/User.model");

const router = require("express").Router();
const saltRounds = 12;

//Signup form
router.get("/signup", async (req, res, next) => {
  const root = __dirname.replace("routes", "");
  console.log(root);
  res.sendFile("views/auth/signup.html", { root });
});

//Signup request
router.post("/signup", async (res, req, next) => {
  try {
    const { username, password, passwordConfirmation } = req.body;
    const foundUsername = await User.find({ username });
    if (foundUsername) {
      res.status(409).json({
        message:
          "Username already exists. Try a different one or go to log in if it's yours.",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: "Please enter a valid password." });
      return;
    }

    if (password !== passwordConfirmation) {
      res.status(400).json({
        message: "Password confirmation does not match. Please try again.",
      });
      return;
    }

    const salt = bcrypt.genSalt(saltRounds);
    const hashedPassword = bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
      isLoggedIn: false,
    });

    res
      .status(201)
      .json({ message: "Created account successfuly." }, createdUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Login request
router.post("/login", async (res, req, next) => {
  const { username, password } = req.body;

  const matchingUser = await User.findOne({ username });

  if (!matchingUser) {
    res
      .status(404)
      .json({ message: "No matching user, please enter a valid username." });
    return;
  }

  const passwordMatch = bcrypt.compare(password, matchingUser.password);

  if (passwordMatch) {
    res.status(200).json({
      message: `Welcome back ${matchingUser.username}!`,
      isLoggedIn: true,
    });
    matchingUser.isLoggedIn = true;
  } else {
    res.status(401).json({ message: "Wrong password. Please try again." });
  }
});
