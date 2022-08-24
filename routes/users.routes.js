const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const isAuthenticated = require("../middleware/middlewares");
const salt = 10;

/**
 * All the routes are prefixed with /users
 */

router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  const { username, password} = req.body;
  if (!password || !username) {
    return res
      .status(400)
      .json({ message: "Please provide a password and username." });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(400).json({
        message:
          "Username already exist, try logging in or registering with an other username.",
      });
    }
    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = {
      username,
      password: hashedPassword
    };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPassword) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: `You should send a name!` });
  }
});

router.get("/main", isAuthenticated, async (req, res, next) => {
  try {
    return res.json(
      "https://s.keepmeme.com/files/en_posts/20200908/blurred-surprised-cat-meme-5b734a45210ef3b6657bcbe2831715fa.jpg"
    );
  } catch (error) {
    next(error);
  }
});

router.get("/private", isAuthenticated, async (req, res, next) => {
  try {
    return res.json(
      "https://www.icegif.com/wp-content/uploads/cat-icegif-15.gif"
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
