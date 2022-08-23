const router = require("express").Router();

/* GET default route */
router.get("/", (req, res, next) => {
  res.json({ success: true });
});

router.use("/auth", require("./auth.route"));
router.use("/", require("./other.route"));

module.exports = router;
