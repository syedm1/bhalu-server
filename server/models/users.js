const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  country: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  modifiedAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token

  const datediff = this.resetPasswordExpire
    ? new Date(this.resetPasswordExpire).getTime() - new Date().getTime()
    : 0;

  if (!this.resetPasswordToken || datediff <= 8 * 60 * 1000) {
    // Hash token and set to resetPasswordToken field
    var resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = resetToken;
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    this.save();
    return resetToken;
  } else {
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    this.save();
    return this.resetPasswordToken;
  }
  // Set expire
  // this.save();
};

mongoose.set("useFindAndModify", false);
module.exports = mongoose.model("users", UserSchema);
