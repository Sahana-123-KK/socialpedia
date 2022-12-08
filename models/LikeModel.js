const { default: mongoose } = require("mongoose");

const LikeSchema = new mongoose.Schema({
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const LikeModel = mongoose.model("likes", LikeSchema);

module.exports = LikeModel;
