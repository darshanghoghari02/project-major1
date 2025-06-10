const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");

const listing = require("./router/listing.js");
const review = require("./router/review.js");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/major1");
}

// listing
app.use("/listing", listing);
// review
app.use("/listing/:id/review", review);

app.get("/getcookies", (req, res) => {
  res.cookie("hello", "namaste");
  res.cookie("key", "value");
  res.send("Cookkies");
});

app.get("/", (req, res) => {
  res.send("Root Request");
});

app.use((req, res, next) => {
  next(new expressError(404, "Page Not Found !!!"));
});

app.use((err, req, res, next) => {
  let { status = 400, message = "Somthing Wrong" } = err;
  res.status(status).render("listing/error.ejs", { err });
});

app.listen(3000, () => {
  console.log(`app is listening on port 3000`);
});
