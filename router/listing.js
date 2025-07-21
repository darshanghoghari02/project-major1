const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const expressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../model/listing.js");
const { isLogin } = require("../middleware.js");

const validatelisting = async (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errmsg);
  } else {
    next();
  }
};
//show

router.get("/", async (req, res) => {
  let allshow = await Listing.find({});
  res.render("listing/show.ejs", { allshow });
});

// delete route
router.delete(
  "/:id",
  isLogin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listing");
  })
);

// new List

router.get("/new", isLogin, (req, res) => {
  res.render("listing/new.ejs");
});

router.post(
  "/",
  validatelisting,
  asyncWrap(async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    req.flash("success", "New Listing Added");
    await newlisting.save();
    res.redirect("/listing");
  })
);

// edit route

router.get(
  "/edit/:id",
  isLogin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "This Listing Does't Exist");
      return res.redirect("/listing");
    }
    res.render("listing/edit.ejs", { list });
  })
);

router.post(
  "/:id",
  isLogin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listing/${id}`);
  })
);

// detail show

router.get(
  "/:id",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate("reviews");
    if (!list) {
      req.flash("error", "Don't Exist");
      return res.redirect("/listing");
    }
    res.render("listing/detail.ejs", { list });
  })
);

router.get(
  "/search/query",
  asyncWrap(async (req, res) => {
    const { q } = req.query;
    const regex = new RegExp(q, "i"); // case-insensitive search
    const listings = await Listing.find({ title: regex }); // you can add more fields
    res.json(listings);
  })
);

module.exports = router;
