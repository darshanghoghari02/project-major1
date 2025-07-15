const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../module/review.js");
const asyncWrap = require("../utils/asyncWrap.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../module/listing.js");

const validatereview = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

// review

router.post(
  "/",
  validatereview,
  asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "Review Added");

    res.redirect(`/listing/${listing._id}`);
  })
);

// review DELETE

router.delete(
  "/:reviewid",
  asyncWrap(async (req, res) => {
    let { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("error", "Review Deleted");
    res.redirect(`/listing/${id}`);
  })
);

module.exports = router;
