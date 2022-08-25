const router = require("express").Router();
const User = require("./../models/User.model.js");
const bcrypt = require("bcryptjs");
const salt = 10;
//const password = "password";
/* GET default route */
router.get("/", (req, res, next) => {
  return res.status(200).json(allUsers);
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  if (!password || !username) {
    return res
      .status(400)
      .json({ message: "Please provide a password and username." });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      return res.status(400).json({
        message:
          "Username already exist, try logging in or registering with an other username.",
      });
    }
    const generatedSalt = bcrypt.genSaltSync(salt);
    const hashedPassword = bcrypt.hashSync(password, generatedSalt);

    const newUser = {
      username,
      password: hashedPassword,
    };
    const createdUser = await User.create(newUser);
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const matchingPassword = bcrypt.compareSync(password, foundUser.password);
    if (!matchingPassword) {
      return res.status(400).json({ message: "wrong credentials" });
    }

    const payload = { username };
    const token = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    res.status(200).json(token);
  } catch (error) {
    next(error);
  }
});

router.get("/main", isAuthenticated, async (req, res, next) => {
  try {
    res.json(
      "https://www.google.com/search?q=funny+cat&client=firefox-b-d&hl=sr&sxsrf=ALiCzsb7hfCYNNn-eWxqspFe8lOT_VXmAw:1661344336340&source=lnms&tbm=isch&sa=X&ved=2ahUKEwi4jJH4vd_5AhWB4oUKHRYkCX4Q_AUoAXoECAIQAw&biw=1536&bih=731&dpr=1.25#imgrc=8uQCl8C6R992FM"
    );
  } catch (error) {
    next(error);
  }
});

router.get("/private", isAuthenticated, async (req, res, next) => {
  console.log("protected route", req.user);
  try {
    res.json("https://giphy.com/gifs/cat-funny-WXB88TeARFVvi");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
