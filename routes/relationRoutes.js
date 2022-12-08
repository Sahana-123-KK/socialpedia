const express = require("express");
const {
  changeRelation,
  getFriends,
} = require("../controllers/relationController");
const checkUser = require("../middleware/getUser");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello ");
});

router.post("/change", checkUser, changeRelation);
router.get("/getfriends", checkUser, getFriends);
module.exports = router;
