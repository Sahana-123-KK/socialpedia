const { default: mongoose } = require("mongoose");

const RelationSchema = new mongoose.Schema({
  followerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  followedid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const RelationModel = mongoose.model("relation", RelationSchema);

module.exports = RelationModel;
