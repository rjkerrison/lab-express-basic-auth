const router = require("express").Router();
const User = require("../models/User.model.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    res.json(
      "https://img.static-rmg.be/a/view/q75/w/h/1747384/funny-cat-fails-20-605-jpg.jpg"
    );
  } catch (err) {
    next();
  }
});

module.exports = router;
