const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDb = require("./db/connection");
const app = express();
app.use(express.json());
app.use(cors());
connectDb();

app.get("/", (req, res) => {
  res.send("Welcome to home endpt");
});

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postsRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/relation",require("./routes/relationRoutes"))
// app.use("/api/likes")

app.listen(9000, () => {
  console.log("Connected To Backend");
});
