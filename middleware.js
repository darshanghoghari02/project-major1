const Listing = require("./model/listing.js");
const Review = require("./model/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const expressError = require("./utils/expressError.js");

module.exports.isLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "First to login");
    return res.redirect("/login");
  }
  next();
};

module.exports.currenturl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "This Listing Does't Exist");
    return res.redirect("/listing");
  }
  if (!list.owner.equals(res.locals.curntUser._id)) {
    req.flash("error", "You Don't Have Permission to do this");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validatelisting = async (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.validatereview = async (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.reviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const review = await Review.findById(reviewid);

  if (!review.author.equals(res.locals.curntUser._id)) {
    req.flash("error", "You Don't Have Permission to do this");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
