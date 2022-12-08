const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fbLink: {
    type: String,
  },
  instaLink: {
    type: String,
  },
  city: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "pic",
  },
  coverPic: {
    type: String,
  },
  job: {
    type: String,
  },
  status: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
