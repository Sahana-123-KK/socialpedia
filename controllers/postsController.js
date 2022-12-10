const { default: mongoose } = require("mongoose");
const LikeModel = require("../models/LikeModel");
const PostsModel = require("../models/PostsModel");
const RelationModel = require("../models/RelationModel");
const UserModel = require("../models/UserModel");
const CommentModel = require("../models/CommentModel");

const createPost = async (req, res) => {
  const { message, pic, tags } = req.body;
  if (!message) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }
  const newPost = await PostsModel.create({
    message,
    pic,
    tags,
    userid: req.user,
    name: req.userdata.name,
    city: req.userdata.city,
    profilePic: req.userdata.profilePic,
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

  let itscomments = await CommentModel.find({ postid: id });
  console.log(itscomments);

  await Promise.all(
    itscomments.map((item, ind) => {
      return CommentModel.findByIdAndDelete(item._id);
    })
  );

  let likes = await LikeModel.find({ postid: id });
  await Promise.all(
    likes.map((item, ind) => {
      return LikeModel.findByIdAndDelete(item._id);
    })
  );

  res.json({ message: "Post Deleted Successfully" });
};
const getPosts = async (req, res) => {
  const all = await PostsModel.find();
  res.json({ allPosts: all });
};

const updatePost = async (req, res) => {
  const { pic, message, tags } = req.body;
  let upPost = {};

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
    const post = await PostsModel.findById(id);
    await PostsModel.findByIdAndUpdate(
      id,
      {
        $set: { likeCount: post.likeCount + 1 },
      },
      { new: true }
    );
    res.json({ message: "Liked the Post", newLike });
  } else {
    await LikeModel.findOneAndDelete({ userid: req.user, postid: id });
    const post = await PostsModel.findById(id);
    await PostsModel.findByIdAndUpdate(
      id,
      { $set: { likeCount: post.likeCount - 1 } },
      { new: true }
    );

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

const getOthersPost = async (req, res) => {
  const { userid } = req.body;
  if (!userid) {
    return res.status(402).json({ error: "Fill userid field" });
  }
  const posts = await PostsModel.find({ userid });

  // const friendsid = await RelationModel.find({ followerid });
  // const posts = await Promise.all(
  //   friendsid.map((item, ind) => {
  //     return PostsModel.find({ userid: item.followerid.toString() });
  //   })
  // );
  return res.json({ posts });
};

const getUserPosts = async (req, res) => {
  // let try=[]

  const friendsid = await RelationModel.find({ followerid: req.user });

  const posts = await Promise.all(
    // friendsid.forEach((id) => {
    //   return PostsModel.find({ userid: id.followedid.toString() });
    //   // console.log(post);
    // })\
    friendsid.map((item, ind) => {
      return PostsModel.find({ userid: item.followedid.toString() });
      // return PostsModel.find({ item.followerid: req.user });
    })
  );
  res.json({ posts });

  // const posts = await PostsModel.find({userid:})
  // console.log(friendsid);
  // const posts = await Promise.all(
  //   friendsid.map((item) => {
  //     // console.log(item);
  //     let some = PostsModel.find({ userid: item.followedid.toString() });
  //     // let an = { ...some };
  //     // some.forEach((post) => {
  //     //   tr.push(post);
  //     // });

  //     console.log(some);

  //     for (let int = 0; int < some.length; int++) {
  //       const element = some[int];
  //       tr.push(element);
  //     }
  //     console.log(tr);

  //     return 2;
  //   })
  // );

  // const comm = await Promise.all(
  //   posts.map((item) => {
  //     return CommentModel.find({ postid: item._id.toString() });
  //   })
  // );
  // console.log(posts);

  // console.log(tr);
  // let correctpost = posts[0];
  // console.log(correctpost);

  // const likescount = await Promise.all(
  //   correctpost.map((item) => {
  //     // console.log(item._id);
  //     console.log(item);
  //     // console.log(item._id.toString());
  //     let likes = LikeModel.countDocuments({ postid: item._id.toString() });
  //     return likes;
  //   })
  // );
  // console.log(likescount);

  // const comments = await Promise.all(
  //   correctpost.map((item) => {
  //     return CommentModel.find({ postid: item._id.toString() });
  //   })
  // );

  // allPosts = posts.map((item, ind) => {
  //   return { post: item, like: likescount[ind], comments: comments[ind] };
  // });

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
  getOthersPost,
};
