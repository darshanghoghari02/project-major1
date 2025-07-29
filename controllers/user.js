const User = require("../model/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.singUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newuser = new User({ username, email });
    let registeruser = await User.register(newuser, password);
    req.login(registeruser, (err) => {
      if (err) {
        req.flash("error", "Login failed after registration");
        return res.redirect("/signup");
      }
      req.flash("success", "Welcome to the site!");
      res.redirect("/listing");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.logIn = async (req, res) => {
  req.flash("success", "welcome");
  res.redirect(res.locals.redirectUrl || "/listing");
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "you are logout website");
    res.redirect("/listing");
  });
};
