const express = require("express");
const checkUser = require("../middleware/getUser");
const {
  getOthersPost,
  getOurPosts,
  createPost,
  deletePosts,
  getUserPosts,
  getSavedPosts,
  getPosts,
  saveOrUnsavePost,
  updatePost,
  likePost,
  getFullSavedPosts,
} = require("../controllers/postsController");
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Welcome to posts route");
});

router.post("/create", checkUser, createPost);
router.delete("/delete/:id", checkUser, deletePosts);
router.get("/allposts", getPosts);
router.put("/update/:id", checkUser, updatePost);
router.post("/likepost/:id", checkUser, likePost);
router.get("/userposts", checkUser, getUserPosts);
router.get("/myposts", checkUser, getOurPosts);
router.post("/getotherspost", getOthersPost);
router.post("/saveposts", checkUser, saveOrUnsavePost);
router.get("/getsavedposts", checkUser, getSavedPosts);
router.get("/getfullsavedposts", checkUser, getFullSavedPosts);
module.exports = router;
