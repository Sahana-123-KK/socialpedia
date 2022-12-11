const { default: mongoose } = require("mongoose");

const CommentSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  profilePic: {
    type: String,
  },
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  comment: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // profilePic: {
  //   type: String,
  //   required: true,
  // },

  commentAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentModel = mongoose.model("comments", CommentSchema);

module.exports = CommentModel;
