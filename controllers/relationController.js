const RelationModel = require("../models/RelationModel");
const UserModel = require("../models/UserModel");

const changeRelation = async (req, res) => {
  const { followedid } = req.body;

  if (!followedid) {
    return res.status(402).json({ error: "Send the FollowedId" });
  }

  try {
    const isFollowing = await RelationModel.findOne({
      followedid,
      followerid: req.user,
    });

    if (!isFollowing) {
      const newFollow = await RelationModel.create({
        followedid,
        followerid: req.user,
      });
      res.json({ message: "Follwed Successfully", newFollow });
    } else {
      await RelationModel.findOneAndDelete({
        followedid,
        followerid: req.user,
      });
      res.json({ message: "Not Following Now" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getFriends = async (req, res) => {
  try {
    const friendsid = await RelationModel.find({ followerid: req.user });
    // res.json({ friends });
    const friends = await Promise.all(
      friendsid.map((item) => {
        return UserModel.findById(item.followedid.toString());
      })
    );

    res.json({ friends });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { changeRelation, getFriends };
