const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../model/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post(
  "/signup",
  asyncWrap(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new User({ username, email });
      let registeruser = await User.register(newuser, password);
      req.flash("success", "welcome!");
      res.redirect("/listing");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "welcome");
    res.redirect("/listing");
  }
);

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "you are logout website");
    res.redirect("/listing");
  });
});

module.exports = router;
