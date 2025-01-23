/*
 * Package Imports
 */

const path = require("path");
require("dotenv").config();
const express = require("express");
const partials = require("express-partials");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

const app = express();

app.use(
  session({
    secret: "codecademy",
    resave: false,
    saveUninitialized: false,
  })
);

/*
 * Variable Declarations
 */

const PORT = 3000;
const GITHUB_CLIENT_ID = "";
const GITHUB_CLIENT_SECRET = "";

/*
 * Passport Configurations
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

/*
 *  Express Project Setup
 */
app.use(passport.initialize());
app.use(passport.session());

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

/*
 * Routes
 */

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get("/auth/github/callback", passport.authenticate("github", { failureRedirect: "/login" }), function (req, res) {
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/account", (req, res) => {
  res.render("account", { user: req.user });
});

app.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

/*
 * Listener
 */

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
 */
