const path = require('node:path'),
  router = require('express').Router(),
  root = path.normalize(`${__dirname}/..`),
  jwt = require('jsonwebtoken');



router.use(`/`, (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.replace('Bearer ', '');

    jwt.verify(token, process.env.TOKEN_SECRET);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/main', async (req, res, next) => {
  try {
    res.sendFile(`views/auth/main.html`, { root });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/private', async (req, res, next) => {
  try {
    res.sendFile(`views/auth/private.html`, { root });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router