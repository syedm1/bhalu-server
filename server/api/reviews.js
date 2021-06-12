const express = require("express");
const Post = require("../models/review"); // new
const router = express.Router();

// Get all reviews
router.get("/reviews", async (req, res) => {
  console.log("in get");
  const posts = await Post.find();
  res.send(posts);
});

router.post("/reviews", async (req, res) => {
  console.log(req.body.title);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  await post.save();
  console.log(post);
  res.send(post);
});

router.get("/reviews/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  res.send(post);
});

module.exports = router;
