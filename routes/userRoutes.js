const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAllProfiles,
  completeProfile,
} = require("../controllers/userController");
const checkUser = require("../middleware/getUser");

router.get("/", (req, res) => {
  res.send("hello welcome to router");
});

router.post("/signup", signup);
router.post("/login", login);
router.put("/completeprofile", checkUser, completeProfile);
router.get("/allprofiles", getAllProfiles);

module.exports = router;
