module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("ERROR_MESSAGE", "Your are not Authorized user");
    req.redirect("/auth/login", 302, {});
  },
};
