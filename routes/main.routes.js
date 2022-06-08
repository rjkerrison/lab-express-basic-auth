const isAuthenticated = require("../middleware/isAuthenticated");

const router = require("express").Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  const root = __dirname.replace("routes", "");
  res.sendFile("views/main/main.html", { root });
});

module.exports = router;
