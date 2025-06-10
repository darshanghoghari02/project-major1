const express = require("express");
const app = express();
const session = require("express-session");

app.use(
  session({ secret: "secretcode", resave: false, saveUninitialized: true })
);

app.get("/session", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`you refresh to ${req.session.count} time`);
});

app.listen(4000, () => {
  console.log(`app is listening on 4000 port`);
});

// const express = require("express");
// const app = express();
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secrtecode"));

// app.get("/setcookies", (req, res) => {
//   res.cookie("home", "town", { signed: true });
//   res.send("cookies is sets");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.cookies);
//   console.log(req.signedCookies);
//   res.send("cookies is parser");
// });
