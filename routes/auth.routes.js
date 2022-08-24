const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model.js');

/* POST signup route */
router.post('/signup', async (req, res, next) => {
  try {
    const hashPwd = await bcryptjs.genSalt(10).then(salt => bcryptjs.hash(req.body.password, salt));
    const newUser = await User.create({
      username: req.body.username,
      password: hashPwd
    });
    res.status(201).json({ newUser });
  } catch (error){
    if (error.code === 11000)
      error.message = 'This username is taken. Try something else.';
    next(error.message);
  }
});

/* POST login route */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      throw ({ message: "Please provide a valid login and password." });
    else {
      const user = await User.findOne({ username: username });
      if (user){
	if (bcryptjs.compareSync(password, user.password)){
          const { _id, username } = user;
          const payload = { _id, username };
	  const authToken = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: "6h" }
          );
	  res.status(200).json({ authToken: authToken });
	}
	else
	  throw ({ message: "Wrong password." });
      }
      else
	throw ({ message: "Wrong username." });
    }
  } catch (error){
    next(error.message);
  }
});

module.exports = router;
