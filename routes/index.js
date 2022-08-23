const router = require("express").Router();
const usersRoute = require("./users.routes");

/* GET default route */
router.get("/", (req, res, next) => {
  res.json({ success: true });
});

router.get("/user", usersRoute);

module.exports = router;
