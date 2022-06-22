const router = require("express").Router();

/* GET default route */
router.get("/", (req, res, next) => {
  res.json({ success: true });
});

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/cae-labtest";

module.exports = router;
