const jwt = require("jsonwebtoken");
const { USER_ROLES } = require("../../constants");

exports.auth =
  ({ roles }) =>
  (req, res, next) => {
    console.log("USER_ROLE", req.user.role);
    console.log("USER", req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .send({ auth: false, message: "Unauthorized User." });
    }
    return next();
  };
