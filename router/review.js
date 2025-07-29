const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrap = require("../utils/asyncWrap.js");
const { validatereview, reviewAuthor, isLogin } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// review

router.post("/", isLogin, validatereview, asyncWrap(reviewController.createReview));

// review DELETE

router.delete(
  "/:reviewid",
  isLogin,
  reviewAuthor,
  asyncWrap(reviewController.destoryReview)
);

module.exports = router;
