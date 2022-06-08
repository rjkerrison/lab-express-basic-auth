const router = require("express").Router();
const saltRounds = 10;
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model");

/* GET default route */

/* POST default route */
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username or password are empty
    if (username === "" || password === "") {
      res
        .status(400)
        .json({ message: "Please, provide a username and password" });
      return;
    }

    // Check if a user already exists in the database for this username.
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res
        .status(401)
        .json({ message: "Usersame already exists. Try logging in instead." });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPassword,
    });
    res.status(201).json(createdUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

/* POST /login
Logging the user into our website
*/
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      res.status(404).json({ message: "username does not exist" });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordMatched) {
      res.status(401).json({ message: "password does not match" });
      return;
    }

    const payload = { username };

    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "10s",
    });

    res.status(200).json({
      isLoggedIn: true,
      message: "yayayaya you are " + username,
      authToken,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/verify", async (req, res, next) => {
  // Verify the user token is still valid
  // get the user token from the header
  console.log(req.headers);
  const { authorization } = req.headers;

  // isolate the jwt
  const token = authorization.replace("Bearer ", "");
  console.log({ token });

  try {
    // verify the jwt with the jsonwebtoken package
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    console.log({ payload });

    // send the user the payload
    res.json({ token, payload });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;
