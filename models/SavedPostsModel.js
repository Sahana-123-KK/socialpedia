const { default: mongoose } = require("mongoose");

const SavedPostsSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  postsSaved: [
    {
      postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    },
  ],
});

const SavedPostsModel = mongoose.model("savedposts", SavedPostsSchema);
module.exports = SavedPostsModel;
