const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

/* GET default route */
router.get('/', (req, res, next) => {
  res.json({ success: true })
})

router.use('/auth', require('./user.route'))

module.exports = router

// create main route 
router.get("/main", isAuthenticated, async (req, res, next) => {
  try {
    res.json(
      "https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif"    );
  } catch (error) {
    next(error);
  }
});
router.get("/private", isAuthenticated, async (req, res, next) => {
  console.log("protected route", req.user);
  try {
    res.json("https://media.giphy.com/media/y9hjvnO2bwJbO/giphy.gif");
  } catch (error) {
    next(error);
  }
});
