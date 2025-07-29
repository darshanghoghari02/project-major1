const Listing = require("../model/listing.js");
const { all } = require("../router/listing.js");

module.exports.listingShow = async (req, res) => {
  const { category } = req.query;
  let allshow;
  if (category) {
    allshow = await Listing.find({ category: category });
    return res.render("listing/show.ejs", { allshow });
  } else {
    allshow = await Listing.find({});
  }

  res.render("listing/show.ejs", { allshow });
};

module.exports.listingDestory = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("error", "Listing Deleted");
  res.redirect("/listing");
};

module.exports.listingNew = async (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.listingCreate = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new Listing(req.body.listing);

  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  newlisting.category = req.body.listing.category;

  await newlisting.save();

  req.flash("success", "New Listing Added");
  res.redirect("/listing");
};

module.exports.listingEdit = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "This Listing Does't Exist");
    return res.redirect("/listing");
  }
  originalImage = list.image.url;
  originalImageurl = originalImage.replace("/upload", "/upload/w_250/");
  res.render("listing/edit.ejs", { list, originalImageurl });
};

module.exports.listingUpdate = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listing/${id}`);
};

module.exports.listingDetail = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!list) {
    req.flash("error", "Don't Exist");
    return res.redirect("/listing");
  }
  res.render("listing/detail.ejs", { list });
};

module.exports.listingSearch = async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, "i"); // case-insensitive search
  const listings = await Listing.find({ title: regex }); // you can add more fields
  res.json(listings);
};
