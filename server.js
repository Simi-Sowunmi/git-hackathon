const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const mongoose = require("mongoose");
const Contact = require("./models/contact.js");
const User = require("./models/form.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

// console.log(process.env);
const URI = "mongodb+srv://similoluwa:$im500250@africaagility.zim22.mongodb.net/node-tuts?retryWrites=true&w=majority";

mongoose
  .connect(process.env.URI)
  .then((res) => {
    console.log("database connected");

    app.listen(PORT, () => {
      console.log("listening on port", PORT);
    });
  })
  .catch((err) => {
    console.log("error connecting", err);
  });

const bodyParser = require("body-parser");

app.set("view engine", "ejs");

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// passport.use(new LocalStrategy(User.authenticate()));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("landing-index")
  
});
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/product", (req, res) => {
  res.render("search");
});

app.get("/drug", (req, res) => {
  res.render("drug");
});

app.get("/emergency", (req, res) => {
  res.render("emergency");
});


app.get("/login", (req, res) => {
  res.render("signin", { error: false, success: false, values: {} });
});
app.post("/login", (req, res) => {
  console.log("The request posted to signin", req.body);
  const email = req.body.email;
  const payload = {
    fullname: req.body.name,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    message: req.body.message,
  };
  // save to database
  // const user = new User(payload);
  User.findOne({ email }).then((user) => {
    if (user) {
      // errors.push({ msg: "Email is already registered" });

      res.render("signin", {
        error: "Email already registered",
        success: false,
        values: {},
      });
    } else {
      const newUser = new User(payload);
      console.log(newUser);
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              console.log(user);
              // req.flash("success_msg", "You are now registered and can log in");
              // res.redirect("/login");
              res.render("/login", {
                error: false,
                success: "Successfully signed up, Please log in",
                values: {},
              });
            })
            .catch((err) => console.log(err));
        })
      );
    }
  });
});

app.post("/login", (req, res, next) => {
  // loginRouter.post("/", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
  // });

  // module.exports = loginRouter;
});

