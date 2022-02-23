const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const UserSchema = require("../Model/Auth");

module.exports = passport => {
  passport.use(
    new LocalStrategy(
         { usernameField: "email" },
      async (email, password, done) => {
        let user = await UserSchema.findOne({ email });
        //   check user email is exist or not
        if (!user) {
          done(null, false, { message: "User does not exists" });
        }
        //   match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (!isMatch) {
            done(null, false, { message: "Password is not match" });
          } else {
              return done(null,user)
          }
        });
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    UserSchema.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
