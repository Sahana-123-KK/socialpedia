const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/getUser");
const {
  createComment,
  deleteComment,
  updateComment,
  getComments,
} = require("../controllers/commentsController");

router.get("/", (req, res) => {
  res.send("Welcome to comment routes");
});

router.post("/create", checkUser, createComment);
router.delete("/delete/:id", checkUser, deleteComment);
router.put("/update/:id", checkUser, updateComment);
router.get("/getcomments", getComments);
// router.get("/postcomments/")

module.exports = router;
