const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  profilePic:{
    type:String
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
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
  likeCount: {
    type: Number,
    default: 0,
    // required: true,
  },
  comments: {
    type: [{ type: Object }],
  },
});

const PostsModel = mongoose.model("posts", PostSchema);

module.exports = PostsModel;
