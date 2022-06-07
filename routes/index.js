const router = require("express").Router();
const jsonwebtoken = require("jsonwebtoken");
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
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      res.status(404).json({ message: "username not found, try to sign in" });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordMatched) {
      res
        .status(401)
        .json({ message: "password does not match, forgot your password?" });
      return;
    }

    const payload = { username };
    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "3d",
    });
    res.status(200).json({ message: "Welcome back " + username, authToken });
  } catch (err) {
    next(err);
  }
});

// Verify 

router.get('/verify', async (req,res,next) => {
  const {authorization} = req.headers 

  const token = authorization.replace('Bearer ', '')

  try {
    const payload = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)

    res.json({token, payload})
  } catch (err){
    res.status(400).json ({message : 'Invalid token'})
    next(err)
  }
})

module.exports = router;
