var express = require("express");
var router = express.Router();
var passport = require("passport");
const authCon = require("../controllers/userController");
// const sendEmail = require('../../utils/sendEmailWithAPI');
// const sendEmail = require("../../utils/sendEmailWithSMTP");
var { auth } = require("../middlewares/auth");
const { USER_ROLES } = require("../../constants");

/**
 * @swagger
 * /api/auth/signup:
 *    get:
 *      description: API call for signing up new users
 *      responses:
 *         '200':
 *            description: This should return all the reviews
 */
router.post("/signup", authCon.signup);
/**
 * @swagger
 * /api/auth/login:
 *    get:
 *      description: API call for validating eligible users to login
 *      responses:
 *         '200':
 *            description: Success
 */
router.post("/login", authCon.login);

// router.get("/google", authCon.googleAuth);
// router.get("/google/callback", authCon.authGoogle, authCon.authGoogleCallback);
// router.get("/authenticate", authCon.authenticate);
// router.get("/logout", authCon.logout);
// router.post("/forgot_password", authCon.forgetPassword);
// router.post("/verify_pass_reset_token", authCon.verifyPasswordResetToken);
// router.post("/reset_password", authCon.resetPassword);

// router.get("/mail", (req, res) => {
//   // return res.json({ success: "true" });
//   sendEmail({
//     to: req.query.email,
//     subject: "TESTING EMAIL",
//     text: "TESTING EMAIL",
//     html: `<p>TESTING EMAIL SENDING</p>`,
//   });
//   res.json({ success: "true" });
// });

// router.get("/", auth({ roles: [USER_ROLES.ADMIN] }), authCon.getUsers);
// router.get("/:id", auth({ roles: [USER_ROLES.ADMIN] }), authCon.getSingleUser);
// router.post(
//   "/change-password-admin/:id",
//   auth({ roles: [USER_ROLES.ADMIN] }),
//   authCon.changePasswordAdmin
// );

module.exports = router;
