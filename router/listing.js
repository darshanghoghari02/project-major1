const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const { isLogin, isOwner, validatelisting } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//show

router
  .route("/")
  .get(listingController.listingShow)
  .post(
    isLogin,
    upload.single("listing[image]"),
    validatelisting,
    asyncWrap(listingController.listingCreate)
  );

// new List

router.get("/new", isLogin, listingController.listingNew);

router
  .route("/:id")
  .get(asyncWrap(listingController.listingDetail))
  .post(
    isLogin,
    isOwner,
    upload.single("listing[image]"),
    asyncWrap(listingController.listingUpdate)
  )
  .delete(isLogin, isOwner, asyncWrap(listingController.listingDestory));

// edit route

router.get(
  "/edit/:id",
  isLogin,
  isOwner,
  asyncWrap(listingController.listingEdit)
);

router.get("/search/query", asyncWrap(listingController.listingSearch));

module.exports = router;
