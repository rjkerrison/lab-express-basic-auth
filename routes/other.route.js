const router = require("express").Router();
const { isAuthenticated } = require("../middleware/middleware.js");

router.get("/main", isAuthenticated, async (req, res, next) => {
  try {
    res.json({
      pic: "https://http.cat/200",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/private", isAuthenticated, async (req, res, next) => {
  try {
    res.json({
      pic: "https://http.cat/200",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
