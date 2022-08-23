const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model");

const isAuthenticated = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({ message: "Missing authorization header" });
    return;
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);

    const { username } = decodedJwt;
    const user = await User.findOne({ username });

    req.user = user;
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  next();
};

module.exports = isAuthenticated;
