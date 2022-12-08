const { default: mongoose } = require("mongoose");
const LikeModel = require("../models/LikeModel");
const PostsModel = require("../models/PostsModel");
const RelationModel = require("../models/RelationModel");
const UserModel = require("../models/UserModel");
const CommentModel = require("../models/CommentModel");

const createPost = async (req, res) => {
  const { title, message, pic, tags } = req.body;
  if (!title || !message) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }
  const newPost = await PostsModel.create({
    title,
    message,
    pic,
    tags,
    userid: req.user,
  });
  res.json({ message: "Post Created Successfully", newPost });
};

const deletePosts = async (req, res) => {
  const { id } = req.params;
  const valid = mongoose.Types.ObjectId.isValid(id);
  if (!valid) {
    return res.status(402).json({ error: "Not a valid post" });
  }
  const isExists = await PostsModel.findById(id);
  if (!isExists) {
    return res.status(404).json({ error: "Not found" });
  }
  if (req.user !== isExists.userid.toString()) {
    return res.status(402).json({ error: "Not Allowed" });
  }

  await PostsModel.findByIdAndDelete(id);
  res.json({ message: "Post Deleted Successfully" });
};
const getPosts = async (req, res) => {
  const all = await PostsModel.find();
  res.json({ allPosts: all });
};

const updatePost = async (req, res) => {
  const { title, pic, message, tags } = req.body;
  let upPost = {};
  if (title) {
    upPost.title = title;
  }
  if (message) {
    upPost.message = message;
  }
  if (pic) {
    upPost.pic = pic;
  }
  if (tags) {
    upPost.tags = tags;
  }

  try {
    const { id } = req.params;
    const valid = mongoose.Types.ObjectId.isValid(id);
    if (!valid) {
      return res.status(402).json({ error: "Not a valid post" });
    }
    const isExists = await PostsModel.findById(id);
    if (!isExists) {
      return res.status(404).json({ error: "Not found" });
    }
    if (req.user !== isExists.userid.toString()) {
      return res.status(402).json({ error: "Not Allowed" });
    }

    const updated = await PostsModel.findByIdAndUpdate(
      id,
      { $set: upPost },
      { new: true }
    );

    res.json({ message: "Post Updated Successfully", updatedPost: updated });
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (req, res) => {
  const { id } = req.params;
  let newLike;
  const liked = await LikeModel.findOne({ userid: req.user, postid: id });
  if (!liked) {
    newLike = await LikeModel.create({ postid: id, userid: req.user });
    res.json({ message: "Liked the Post", newLike });
  } else {
    await LikeModel.findOneAndDelete({ userid: req.user, postid: id });
    res.json({ message: "Unliked The Post" });
  }
};

const getOurPosts = async (req, res) => {
  try {
    const ours = await PostsModel.find({ userid: req.user });
    res.json({ yourPosts: ours });
  } catch (error) {
    console.log(error);
  }
};

const getUserPosts = async (req, res) => {
  // let try=[]
  let allPosts = [];
  let tr = [];
  const friendsid = await RelationModel.find({ followerid: req.user });
  // const posts = await PostsModel.find({userid:})
  // console.log(friendsid);
  const posts = await Promise.all(
    friendsid.map((item) => {
      // console.log(item);
      let some = { ...PostsModel.find({ userid: item.followedid.toString() }) };
      tr = [...tr, some];
      // return { ...posts, ...some };
    })
  );
  console.log(tr);
  // let correctpost = posts[0];
  // console.log(correctpost);

  const likescount = await Promise.all(
    correctpost.map((item) => {
      // console.log(item._id);
      console.log(item);
      // console.log(item._id.toString());
      let likes = LikeModel.countDocuments({ postid: item._id.toString() });
      return likes;
    })
  );
  console.log(likescount);

  const comments = await Promise.all(
    correctpost.map((item) => {
      return CommentModel.find({ postid: item._id.toString() });
    })
  );

  allPosts = posts.map((item, ind) => {
    return { post: item, like: likescount[ind], comments: comments[ind] };
  });

  res.json({ allPosts });

  // posts.forEach(async (post) => {
  //   let commpro = [];
  //   let comments = await CommentModel.find({ postid: post._id.toString() });
  //   comments.forEach(async (item) => {
  //     let userprofile = await UserModel.findById(item.userid.toString());
  //     commpro = [...commpro, { item, userprofile }];
  //   });
  //   let likes = await LikeModel.countDocuments({ postid: post._id.toString() });
  //   allPosts = [...allPosts, { likes, commpro }];
  // });

  // res.json({ allPosts });

  // const friendInfo = await Promise.all(
  //   friendsid.map((item) => {
  //     return UserModel.findById(item.followedid.toString());
  //   })
  // );
};
module.exports = {
  createPost,
  deletePosts,
  getPosts,
  updatePost,
  likePost,
  getUserPosts,
  getOurPosts,
};
