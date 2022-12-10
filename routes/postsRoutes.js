const express = require("express");
const checkUser = require("../middleware/getUser");
const {
  getOthersPost,
  getOurPosts,
  createPost,
  deletePosts,
  getUserPosts,
  getPosts,
  updatePost,
  likePost,
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

module.exports = router;
