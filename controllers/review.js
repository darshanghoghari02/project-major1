const Listing = require("../model/listing.js");
const Review = require("../model/review.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);
  newreview.author = req.user._id;

  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();
  req.flash("success", "Review Added");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.destoryReview = async (req, res) => {
  let { id, reviewid } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("error", "Review Deleted");
  res.redirect(`/listing/${id}`);
};
