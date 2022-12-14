const { default: mongoose } = require("mongoose");
const LikeModel = require("../models/LikeModel");
const PostsModel = require("../models/PostsModel");
const RelationModel = require("../models/RelationModel");
const UserModel = require("../models/UserModel");
const CommentModel = require("../models/CommentModel");
const SavedPostsModel = require("../models/SavedPostsModel");

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
  // console.log(itscomments);

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

  let savedposts = await SavedPostsModel.findOne({ userid: req.user });
  console.log(savedposts);
  let postssaved = savedposts.postsSaved;
  console.log(postssaved);
  if (postssaved.length !== 0) {
    const others = postssaved.filter((post, ind) => {
      return post.postid.toString() !== id;
    });
    console.log(others);

    await SavedPostsModel.findByIdAndUpdate(
      savedposts._id,
      {
        $set: { postsSaved: others },
      },
      { new: true }
    );
  }
  res.json({ message: "Post Deleted Successfully" });
};

// };
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
const saveOrUnsavePost = async (req, res) => {
  const postid = req.header("postid");
  try {
    const exits = await SavedPostsModel.find({ userid: req.user });
    // console.log(exits);
    if (exits.length === 0) {
      const addSavedPost = await SavedPostsModel.create({
        userid: req.user,
        postsSaved: [{ postid }],
      });
      res.json({ message: "Created Successfully", posts: addSavedPost });
    } else {
      let postsarray = exits[0].postsSaved;
      console.log(postsarray);
      let flag = false;
      // console.log(postsSaved);
      console.log(flag);
      postsarray.forEach((item) => {
        // console.log(item);
        // console.log(postid);
        if (item.postid.toString() === postid) {
          flag = true;
          // break
        }
      });
      console.log(flag);
      if (!flag) {
        // awai
        const addpost = await SavedPostsModel.findByIdAndUpdate(
          exits[0]._id,
          {
            $set: { postsSaved: [...exits[0].postsSaved, { postid }] },
          },
          { new: true }
        );
        res.json({ message: "Added to SavedPosts", posts: addpost });
      }
      // if (exits[0].postsSaved.includes(postid)) {
      //   let others = exits[0].postsSaved.filter((item, ind) => {
      //     return item.toString() !== postid;
      //   });
      // }
      else {
        let others = exits[0].postsSaved.filter((item, ind) => {
          console.log(item);
          return item.postid.toString() !== postid;
        });
        const updated = await SavedPostsModel.findByIdAndUpdate(
          exits[0]._id,
          {
            $set: {
              postsSaved: others,
            },
          },
          { new: true }
        );
        res.json({ message: "Removed From SavedPosts", posts: updated });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const mySavedPosts = await SavedPostsModel.findOne({ userid: req.user });
    res.json({ posts: mySavedPosts });
  } catch (error) {
    console.log(error);
  }
};

const getFullSavedPosts = async (req, res) => {
  try {
    const savedPostsid = await SavedPostsModel.findOne({ userid: req.user });
    // console.log(savedPostsid);
    let postsidarr = savedPostsid?.postsSaved;
    console.log(postsidarr);
    const fullSavedPosts = await Promise.all(
      postsidarr.map((item, ind) => {
        return PostsModel.findById(item.postid);
      })
    );
    // console.log(fullSavedPosts);
    console.log(fullSavedPosts[0]);
    // console.log(fullSavedPosts[1]);
    console.log(fullSavedPosts.length);
    res.json({ posts: fullSavedPosts });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  saveOrUnsavePost,
  getSavedPosts,
  createPost,
  deletePosts,
  getPosts,
  updatePost,
  likePost,
  getUserPosts,
  getOurPosts,
  getOthersPost,
  getFullSavedPosts,
};
