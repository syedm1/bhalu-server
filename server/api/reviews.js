const express = require("express");
const Post = require("../models/review");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const DESCEND = "desc";
const ASCEND = "asc";

/**
 * @swagger
 * /reviews:
 *    get:
 *      description: This should return all reviews
 *      responses:
 *         '200':
 *            description: This should return all reviews
 */
router.get("/reviews", async (req, res) => {
  console.log("in get");
  const posts = await Post.find();
  res.send(posts);
});

/**
 * @swagger
 * /reviews:
 *    post:
 *      description: This should save new review
 *      responses:
 *         '200':
 *            description: This should save new review
 */
router.post("/reviews", async (req, res) => {
  console.log(req.body.title);
  const post = new Post({
    address: req.body.address,
    agentName: req.body.agentName,
    agentAgency: req.body.agentAgency,
    duration: req.body.duration,
    propertyType: req.body.propertyType,
    propertyReview: req.body.propertyReview,
    agentReview: req.body.agentReview,
    propertyRating: req.body.propertyRating,
    agentRating: req.body.agentRating,
  });
  await post.save();
  console.log(post);
  res.send(post);
});

/**
 * @swagger
 * /reviews:
 *    get:
 *      description: This should return all reviews
 *      responses:
 *         '200':
 *            description: This should return all reviews
 */
router.get("/reviews/search", async (req, res) => {
  // const searchQuery = req.query.searchquery;

  console.log("search API");

  const searchQueryAddress = req.body.address;
  console.log(searchQueryAddress);
  const addressRegex = new RegExp(searchQueryAddress, "i");
  if (searchQueryAddress != null) {
    const posts = await Post.find({
      address: addressRegex,
    })
      .limit(10)
      .sort({ updatedAt: DESC });
  } else {
    res.end();
  }
  res.end();
});

/**
 * @swagger
 * /reviews:
 *    get:
 *      description: This should return all reviews
 *      responses:
 *         '200':
 *            description: This should return all reviews
 */
router.get("/reviews/:id", async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id });
  res.send(post);
});

module.exports = router;
