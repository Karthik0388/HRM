const { Router } = require("express");
const UserSchema = require("../Model/Auth");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = Router();
/*@ HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/register
*/
router.get("/register", (req, res) => {
  res.render("../views/auth/register", {});
});
/*@ HTTP GET REQUEST
@ACCESS PUBLIC
@URL /auth/login
*/
router.get("/login", (req, res) => {
  res.render("../views/auth/login", {});
});
/*@ HTTP GET REQUEST
@ACCESS PRIVATE
@URL /auth/login
*/
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("SUCCESS_MESSAGE", "Successfully logged out");
  res.redirect("/auth/login", 302, {});
});

/*@ HTTP POST REQUEST
@ACCESS PUBLIC
@URL /auth/register
*/
router.post("/register", async (req, res) => {
  let { username, email, password, password1 } = req.body;

  let errors = [];
  if (!username) {
    errors.push({ text: "username is required" });
  }
  if (username.length < 6) {
    errors.push({ text: "Username minimum 6 characters" });
  }
  if (!email) {
    errors.push({ text: "Email is required" });
  }
  if (!password) {
    errors.push({ text: "Password is required" });
  }
  if (password !== password1) {
    errors.push({ text: "Password is not match" });
  }
  if (errors.length > 0) {
    res.render("../views/auth/register", {
      username,
      email,
      password,
      password1,
    });
  } else {
    let user = await UserSchema.findOne({ email });
    if (user) {
      req.flash(
        "ERROR_MESSAGE",
        "Email already exists please add new eamil address"
      );
      res.redirect("/auth/register", 302, {});
    } else {
      let newUser = new UserSchema({
        username,
        email,
        password,
      });

      bcrypt.genSalt(12, async (err, salt) => {
        if (err) throw err;
        console.log(salt);
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          console.log(hash);
          newUser.password = hash;
          await newUser.save();
          req.flash(
            "SUCCESS_MESSAGE",
            "Email already exists Please Enter new Email"
          );
          res.redirect("/auth/login", 302, {});
        });
      });
    }
  }
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/employee/emp-profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

module.exports = router;
