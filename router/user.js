const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const User = require("../model/user.js");
const passport = require("passport");
const { currenturl } = require("../middleware.js");

const controllers = require("../controllers/user.js");

router
  .route("/signup")
  .get(controllers.renderSignupForm)
  .post(asyncWrap(controllers.singUp));

router
  .route("/login")
  .get(controllers.renderLoginForm)
  .post(
    currenturl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllers.logIn
  );

router.get("/logout", controllers.logout);

module.exports = router;
