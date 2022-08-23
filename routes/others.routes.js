const isAuthenticated = require("../middleware/isAuthenticated");
const router = require("express").Router();

router.get("/main", isAuthenticated, async (req, res, next) => {
  try {
    res.status(200).json({
      catPic:
        "https://i.pinimg.com/736x/c8/64/22/c86422937a50abff89883392097b1814.jpg",
      link: "http://localhost:3000/",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/private", isAuthenticated, async (req, res, next) => {
  try {
    res.status(200).json({
      gif: "https://media1.giphy.com/media/vyTnNTrs3wqQ0UIvwE/giphy.gif?cid=ecf05e47kymajjaab56bnj5i2llm43xr6an2xz23vwmxo5ca&rid=giphy.gif&ct=g",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
