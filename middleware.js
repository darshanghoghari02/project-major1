module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "First to login");
    return res.redirect("/login");
  }
  next();
};
