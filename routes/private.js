const router = require("express").Router();
const isAuthenticated = require("../middleware/isAuthenticated");

router.get('/', isAuthenticated, (req, res, next) => {
    res.json({ success: true })
  })
  
  module.exports = router