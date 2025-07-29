if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLAS_URI;

// "mongodb://127.0.0.1:27017/major1"

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "secretecode",
  },
  touchAfter: 24 * 3600, // time in seconds
});

store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionOption = {
  store,
  secret: "secretecode",
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: 5 * 24 * 60 * 60 * 1000,
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curntUser = req.user;
  next();
});

// listing
app.use("/listing", listingRouter);
// review
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// app.get("/user", async (req, res) => {
//   let newuser = new User({
//     username: "Darshan",
//     email: "darshan@gmail.com",
//   });

//   let registerUser = await User.register(newuser, "Dar123");
//   res.send(registerUser);
// });

app.get("/getcookies", (req, res) => {
  res.cookie("hello", "namaste");
  res.cookie("key", "value");
  res.send("Cookkies");
});

// app.get("/", (req, res) => {
//   res.send("Root Request");
// });

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
