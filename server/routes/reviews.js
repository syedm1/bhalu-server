const express = require("express");
const Post = require("../models/review");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const DESCEND = "desc";
const ASCEND = "asc";

/**
 * @swagger
 * /api/reviews:
 *    get:
 *      description: This should return all the reviews
 *      responses:
 *         '200':
 *            description: This should return all the reviews
 */
router.get("/reviews", async (req, res) => {
  console.log("Get All reviews");
  const posts = await Post.find();
  res.send(posts);
});

/**
 * @swagger
 * /api/reviews:
 *    post:
 *      description: This should save new review
 *      responses:
 *         '200':
 *            description: This should save new review
 */
router.post("/reviews", async (req, res) => {
  console.log("added : " + req.body.title);
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
  try {
    await post.save();
    console.log(post);
    res.send("post added successfuly");
  } catch (ex) {
    res.send(ex);
  }
});

/**
 * @swagger
 * /api/reviews/search:
 *    get:
 *      description: This should return all reviews for given search params
 *      responses:
 *         '200':
 *            description: This should return all reviews for given search params
 */
router.get("/reviews/search", async (req, res) => {
  console.log("search API");
  const searchQueryAddress = req.body.address;
  const addressRegex = new RegExp(searchQueryAddress, "i");
  if (searchQueryAddress != null) {
    const posts = await Post.find({
      address: addressRegex,
    })
      .limit(10)
      .sort({ updatedAt: DESCEND });
    res.send(posts);
  } else {
    res.end();
  }
  res.end();
});

/**
 * @swagger
 * /api/reviews/:id:
 *    get:
 *      description: This should return review by id
 *      responses:
 *         '200':
 *            description: This should return review by id
 */
router.get("/reviews/:id", async (req, res) => {
  try {
    if (req.params.id) {
      console.log("search by id for: " + req.params.id);
      const post = await Post.findOne({ _id: req.params.id });
      res.send(post);
    }
  } catch (ex) {
    res.send(ex);
  }
});

module.exports = router;
