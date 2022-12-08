const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const KEY = "IWOULDALWAYSLOVETOBETHEBESTWHOWORSHIPSGODANDSHOWSGRATTITUDE";

const checkUser = async (req, res, next) => {
  const token = req.header("token");

  try {
    if (!token) {
      return res.status(402).json({ error: "Not Validated" });
    }
    const data = jwt.verify(token, KEY);
    if (!data) {
      return res.status(402).json({ error: "Not a valid Token" });
    }

    const useris = await UserModel.findById(data.user);
    if (!useris) {
      return res.status(402).json({ error: "User Not Found" });
    }

    req.user = data.user;
    const userData = await UserModel.findById(data.user);
    req.userdata = userData;
    console.log(data.user);

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkUser;
