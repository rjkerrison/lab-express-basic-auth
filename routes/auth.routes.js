const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jsonwebtoken = require("jsonwebtoken");

const router = require("express").Router();
const saltRounds = 10;

// router.get('/signup', async (req, res, next) => {
//   const root = __dirname.replace('routes', '')
//   console.log(root)
//   res.sendFile('views/auth/signup.html', { root })
// })

router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(401).json({ message: "Username already exists." });
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
    console.log(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      res.status(404).json({ message: "Username not found" });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordMatched) {
      res.status(401).json({ message: "password incorrect" });
      return;
    }

    const payload = { username };

    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json({ message: `Logged in as:` + username, authToken });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace("Bearer ", "");

    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

    res.json({ token, payload });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
