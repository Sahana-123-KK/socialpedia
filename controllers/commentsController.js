const { default: mongoose } = require("mongoose");
const CommentModel = require("../models/CommentModel");
const PostsModel = require("../models/PostsModel");
const createComment = async (req, res) => {
  const { comment, postid } = req.body;

  if (!comment || !postid) {
    return res.status(402).json({ error: "Enter all Mandatory Fields" });
  }
  try {
    const valid = await mongoose.Types.ObjectId.isValid(postid);
    if (!valid) {
      return res.status(402).json({ error: "Invalid Post id" });
    }

    const isExists = await PostsModel.findById(postid);

    if (!isExists) {
      return res.status(404).json({ error: "Not Found" });
    }

    const newComment = await CommentModel.create({
      postid,
      comment,
      userid: req.user,
      name: req.userdata.name,
      // profilePic: req.user.profilePic, -->Must b fixed later
    });
    await PostsModel.findByIdAndUpdate(
      postid,
      { $set: { comments: [...isExists.comments, newComment] } },
      { new: true }
    );

    res.json({ message: "Comment Created Successfully", newComment });
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const postid = req.header("postid");

  try {
    const valid = await mongoose.Types.ObjectId.isValid(id);
    if (!valid) {
      return res.status(402).json({ error: "Invalid Comment id" });
    }
    if (!postid) {
      return res.status(402).json({ error: "No Post Id" });
    }
    const isExists = await CommentModel.findById(id);

    if (!isExists) {
      return res.status(404).json({ error: "Not Found" });
    }

    if (req.user !== isExists.userid.toString()) {
      return res.status(402).json({ error: "Not Allowed" });
    }
    let postcommented = await PostsModel.findById(postid);
    await CommentModel.findByIdAndDelete(id);
    let othercomments = postcommented.comments.filter((item, ind) => {
      return item?._id.toString() !== id;
    });

    await PostsModel.findByIdAndUpdate(
      postid,
      { $set: { comments: othercomments } },
      { new: true }
    );

    // await PostsModel.findByIdAndUpdate(postid,${set:{comments: othercomments}},{new:true})
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.log(error);
  }
};
const updateComment = async (req, res) => {
  const { comment } = req.body;
  const { id } = req.params;
  const postid = req.header("postid");
  if (!postid) {
    return res.status(402).json({ error: "No Post Id" });
  }
  if (!comment) {
    return res.status(402).json({ error: "Fill All Mandatory Fields" });
  }

  try {
    const valid = await mongoose.Types.ObjectId.isValid(id);
    if (!valid) {
      return res.status(402).json({ error: "Invalid Comment id" });
    }

    const isExists = await CommentModel.findById(id);

    if (!isExists) {
      return res.status(404).json({ error: "Not Found" });
    }
    if (req.user !== isExists.userid.toString()) {
      return res.status(402).json({ error: "Not Allowed" });
    }
    const upComment = await CommentModel.findByIdAndUpdate(
      id,
      { $set: { comment } },
      { new: true }
    );

    const postup = await PostsModel.findById(postid);
    let othercomments = postup.comments.filter((item, ind) => {
      return item?._id.toString() !== id;
    });

    let correct = [...othercomments, upComment];

    const upPost = await PostsModel.findByIdAndUpdate(
      postid,
      { $set: { comments: correct } },
      { new: true }
    );

    res.json({
      message: "Comment Updated Successfully",
      updatedComment: upComment,
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createComment, deleteComment, updateComment };
