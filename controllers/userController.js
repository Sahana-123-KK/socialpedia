const UserModel = require("../models/UserModel");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const KEY = "IWOULDALWAYSLOVETOBETHEBESTWHOWORSHIPSGODANDSHOWSGRATTITUDE";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }

  try {
    //   console.log("Wee will see");
    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      return res.status(402).json({ error: "User Already Exists" });
    }

    const salt = await bycrypt.genSalt(10);
    const hashed = await bycrypt.hash(password, salt);
    const newUser = await UserModel.create({ name, email, password: hashed });

    const token = await jwt.sign({ user: newUser._id }, KEY);

    res.json({ message: "User Created Successfully", newUser, token });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }
  try {
    const isExist = await UserModel.findOne({ email });
    if (!isExist) {
      return res.status(402).json({ error: "No User Found" });
    }

    const same = await bycrypt.compare(password, isExist.password);
    if (!same) {
      return res.status(402).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ user: isExist._id }, KEY);
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    console.log(error);
  }
};

const completeProfile = async (req, res) => {
  const { status, job, coverPic, profilePic, city, instaLink, fbLink } =
    req.body;
  let upProfile = {};

  if (status) {
    upProfile.status = status;
  }

  if (job) {
    upProfile.job = job;
  }

  if (coverPic) {
    upProfile.coverPic = coverPic;
  }

  if (profilePic) {
    upProfile.profilePic = profilePic;
  }

  if (city) {
    upProfile.city = city;
  }

  if (instaLink) {
    upProfile.instaLink = instaLink;
  }

  if (fbLink) {
    upProfile.fbLink = fbLink;
  }

  //   res.send("completed");

  const complete = await UserModel.findByIdAndUpdate(
    req.user,
    { $set: upProfile },
    { new: true }
  );

  res.json({ message: "Updated Profile Successfully", complete });
};

module.exports = { signup, login, completeProfile };
