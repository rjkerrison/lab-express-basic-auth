const router = require("express").Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

/* GET default route */
router.get("/", (req, res, next) => {
  res.json({ success: true });
});

/* POST / signup */
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(401).json({
        message: `Seems that you already exist! Maybe you should try to log in instead`,
      });
      return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

/* Post login */
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    res
      .status(404)
      .json({ message: "username not found, try to sign in" });
    return;
  }

  const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatched) {
    res
      .status(401)
      .json({ message: "password does not match, forgot your password?" });
    return;
  }
  res.status(200).json({ message: "Welcome back " + username });
});

module.exports = router;
