const mongoose = require("mongoose");

const connectDb = () => {
  mongoose.connect(
    "mongodb+srv://sahana:sahana@cluster0.4tl1qun.mongodb.net/?retryWrites=true&w=majority",

    () => {
      console.log("Connected To Mongo Successfully");
    }
  );
};

module.exports = connectDb;
