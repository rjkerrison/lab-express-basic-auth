const path = require('node:path'),
  router = require('express').Router(),
  User = require('../models/User.model'),
  bcrypt = require('bcryptjs'),
  saltRounds = 10,
  root = path.normalize(`${__dirname}/..`);


router.route(`/signup`)
  // GET /signup; Show a signup form.
  .get(async (req, res, next) => {
    try {
      res.sendFile('views/auth/signup.html', { root });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })

  // POST /signup; Create a user
  .post(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      checkCredentialValidity(res, [username, password]);

      const foundUser = await User.findOne({ username });
      if (foundUser) {
        res
          .status(401)
          .json({ message: 'Username already exists. Try logging in instead.' });
        return;
      }

      const salt = await bcrypt.genSalt(saltRounds),
        hashedPassword = await bcrypt.hash(password, salt);

      await User.create({
        username,
        password: hashedPassword,
      });

      res.sendStatus(201);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });


router.route(`/login`)

  // GET /login; Show a login form.
  .get(async (req, res, next) => {
    try {
      res.sendFile('views/auth/login.html', { root });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })

  // POST /login; Logging the user into our website
  .post(async (req, res, next) => {
    try {
      const { username, password } = req.body;
      checkCredentialValidity(res, [username, password]);

      
      const foundUser = await User.findOne({ username });
      if (!foundUser) {
        res.status(404).json({ message: 'username does not exist' });
        return;
      }

      const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
      if (!isPasswordMatched) {
        res.status(401).json({ message: 'password does not match' });
        return;
      }
      res
        .status(200)
        .json({ isLoggedIn: true, message: 'yayayaya you are ' + username });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });


function checkCredentialValidity(res, credentialArray) {
  const userIsValid = credentialArray.every(el => typeof el === `string` && el.length > 4);

  if (!userIsValid) {
    res.status(400)
      .json({ message: 'Both: Username and Password must be 5 character or longer.' });
    return;
  }
}


module.exports = router