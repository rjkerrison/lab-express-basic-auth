const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    res.json("https://media.giphy.com/media/zGnnFpOB1OjMQ/giphy.gif");
  } catch (err) {
    next();
  }
});

module.exports = router;
