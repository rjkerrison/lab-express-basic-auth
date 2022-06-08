const router = require('express').Router()
const User = require("../models/User.model");

/* GET default route */
router.get('/', (req, res, next) => {
  const allUsers = User.find()
  res.status(200).json(allUsers)
})

module.exports = router
