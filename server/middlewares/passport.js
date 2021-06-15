var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../api/users/model");
const PersonalDetails = require("../api/personal-details/model");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) {
        console.log("err", err);
        return done(null, false, { message: "Something went wrong" });
        // return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.password || !user.comparePassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
      //@todo get bhalu io google credentials
      //callbackURL: "https://www.bhalu.io/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      const { given_name, family_name, email, sub } = profile._json;

      try {
        const user = await User.findOne({ googleId: sub });
        if (!user) {
          const newUser = new User({
            email,
            googleId: sub,
            isEmailVerified: true,
          });
          const nUser = await newUser.save();
          const personalDetails = new PersonalDetails({
            user: nUser._id,
            firstName: given_name,
            lastName: family_name,
          });
          await personalDetails.save();
          return cb(null, nUser);
        } else {
          return cb(null, user);
        }
      } catch (error) {
        console.log(error);
        return cb(null, false);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  // console.log(user);
  next(null, user._id);
});

passport.deserializeUser(function (id, next) {
  console.log(id);
  User.findOne({ _id: id })
    .lean()
    .exec((err, user) => {
      if (err) console.log(err);
      else {
        if (user == null) console.log(user);
        else {
          delete user.password;
          next(null, { ...user, role: "user" });
        }
      }
    });
});
