const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  pic: {
    type: String,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
});

const PostsModel = mongoose.model("posts", PostSchema);

module.exports = PostsModel;
