const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

console.log(isAuthenticated);

router.get('/main', isAuthenticated, async (req, res, next) => {
  try {
    const funnyCat = {url: "https://i.ytimg.com/vi/Zr-qM5Vrd0g/maxresdefault.jpg" };
    res.status(200).json(funnyCat);
  } catch (error) {
    next(error.message);
  }
});

router.get('/private', isAuthenticated, async (req, res, next) => {
  try {
    const private = { url: "https://i.giphy.com/media/MfTW6bkRhvFzbAZO1p/giphy.webp",
		      private: true };
    res.status(200).json(private);
  } catch (error) {
    next(error.message);
  }
});

module.exports = router;
