const mongoose = require("mongoose");

const schema = mongoose.Schema({
  address: String,
  agentName: String,
  agentAgency: String,
  duration: String,
  propertyType: String,
  propertyReview: String,
  agentReview: String,
  propertyRating: mongoose.Types.Decimal128,
  agentRating: mongoose.Types.Decimal128,
});

module.exports = mongoose.model("Review", schema);
