const express = require("express");
const {
  getOthersFriends,
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
router.get("/getothersfriends", getOthersFriends);
module.exports = router;
