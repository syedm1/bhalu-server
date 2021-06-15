const User = require("../models/users");
var passport = require("passport");

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.signup = async (req, res) => {
  try {
    const userFound = await User.findOne({ email: req.body.email });
    if (userFound) {
      return res.status(401).json({
        success: false,
        message: "Email is already registered",
      });
    }
    const newUser = new User({ ...req.body, role: "user" });
    user = await newUser.save();

    return res.status(201).json({
      success: true,
      user,
      message: "Registered Successfully Now You can Login",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error, message: "Server Error" });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.log("here is an error", err);
      return res
        .status(404)
        .json({ success: false, message: "something went wrong" });
    }
    if (user) {
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    }
    if (info) {
      res.status(404).json({ message: info.message });
    }
  })(req, res, next);
};

exports.googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.authGoogle = passport.authenticate("google", {
  failureRedirect: "/login",
});
exports.authGoogleCallback = function (req, res) {
  res.redirect("/dashboard");
};

exports.authenticate = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ authenticated: false });
  } else {
    req.user.password = null;
    return res.status(200).json(req.user);
  }
};

exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      req.session = null;
      if (error) {
        console.log(error);
        return res.send({ success: false });
      }
      res.send({ success: true });
    });
  }
};

// exports.forgetPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     var user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({
//         success: false,
//         message: "There is no account linked with this email",
//       });
//     const token = user.getResetPasswordToken();
//     const resetUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/reset_password/${token}`;
//     await sendEmail({
//       to: email,
//       subject: "Password Reset Link",
//       text: "Here is your Password reset link",
//       html: `<p>Reset you password by clicking <a href=${resetUrl}>here</a></p>`,
//     });
//     return res.status(201).json({
//       success: true,
//       message: "Email with password reset link is sent to your email address",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error, message: "something went wrong" });
//   }
// };

exports.verifyPasswordResetToken = async (req, res) => {
  const { token } = req.body;
  try {
    if (!token)
      return res.status(201).json({ success: false, message: "Invalid Token" });
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user)
      return res.status(201).json({ success: false, message: "Invalid Token" });

    const timediff = user.resetPasswordExpire
      ? new Date(user.resetPasswordExpire).getTime() - new Date().getTime()
      : 0;
    console.log(timediff);
    if (timediff <= 0)
      return res.status(201).json({ success: false, message: "Token Expired" });
    return res.status(201).json({
      success: true,
      _id: user._id,
      message: "Token Verified Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body._id });
    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.markModified("password");
    user.markModified("resetPasswordToken");
    const result = await user.save();
    console.log(result);
    res.status(201).json({
      success: true,
      message: "Password Changed Successfull now you can login",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error, message: "something went wrong" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    let { keyword } = req.query;
    keyword = keyword ? keyword : "";
    const limit = parseInt(req.query.limit);
    const order = parseInt(req.query.order);
    const skip = limit * parseInt(req.query.page);
    const orderBy = { [req.query.orderBy]: order ? order : -1 };
    console.log(req.query, "LIMIT", limit + skip, "SKIP", skip);

    const users = await User.aggregate([
      {
        $lookup: {
          from: "personal_details",
          localField: "_id",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          email: 1,
          country: 1,
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $regex: keyword.toString(),
                $options: "i",
              },
            },
            {
              email: {
                $regex: keyword.toString(),
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $facet: {
          metadata: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
              },
            },
          ],
          data: [{ $sort: orderBy }, { $limit: skip + limit }, { $skip: skip }],
        },
      },
      {
        $project: {
          data: 1,
          // Get total from the first element of the metadata array
          total: { $arrayElemAt: ["$metadata.total", 0] },
        },
      },
    ]);
    res.status(200).json(users[0]);
  } catch (error) {
    console.log("ERROR_MESSAGE", error.message);
    console.log("ERROR", error);
    res
      .status(500)
      .json({ success: false, error, message: "something went wrong" });
  }
};
exports.getSingleUser = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "personal_details",
          localField: "_id",
          foreignField: "user",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          email: 1,
          country: 1,
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] },
        },
      },
    ]);
    res.status(200).json(users[0]);
  } catch (error) {
    console.log("ERROR_MESSAGE", error.message);
    console.log("ERROR", error);
    res
      .status(500)
      .json({ success: false, error, message: "something went wrong" });
  }
};

exports.changePasswordAdmin = async (req, res) => {
  try {
    await User.update(
      { _id: req.params.id },
      { $set: { password: req.body.password } }
    );
    res
      .status(201)
      .json({ success: true, message: "Password Updated Successfully!" });
  } catch (error) {
    console.log("ERROR_MESSAGE", error.message);
    console.log("ERROR", error);
    res
      .status(500)
      .json({ success: false, error, message: "something went wrong" });
  }
};
