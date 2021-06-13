const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  address: {
    type: String,
  },
  agentName: {
    type: String,
  },
  agentAgency: {
    type: String,
  },
  duration: {
    type: String,
  },
  propertyType: {
    type: String,
  },
  propertyReview: {
    type: String,
  },
  agentReview: {
    type: String,
  },
  reviewedBy: {
    type: String,
    default: "anonymous",
  },
  propertyRating: {
    type: mongoose.Types.Decimal128,
  },
  agentRating: {
    type: mongoose.Types.Decimal128,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Review", reviewSchema);
