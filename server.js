"use strict";
require("dotenv").config();
var express = require("express"),
  mongo = require("mongodb"),
  mongoose = require("mongoose"),
  multer = require("multer"),
  upload = multer({ dest: "uploads/" }),
  app = express(),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  flash = require("connect-flash"),
  bodyParser = require("body-parser"),
  port = process.env.PORT || 5000,
  cors = require("cors"),
  passport = require("passport"),
  localStrategy = require("passport-local").Strategy,
  schemas = require("./db"),
  bcrypt = require("bcryptjs"),
  saltRound = 10;
app
  .use(express.static("public"))
  .use(cors())
  .use(cookieParser())
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use(session({ secret: "zaggadat", resave: true, saveUninitialized: true }))
  .use(flash())
  .use(passport.initialize())
  .use(passport.session());
// databse connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema(schemas.user_schema),
  User = mongoose.model("User", userSchema),
  courseSchema = new mongoose.Schema(schemas.course_schema),
  Course = mongoose.model("Course", courseSchema),
  commentSchema = new mongoose.Schema(schemas.comments_schema),
  Comment = mongoose.model("Comment", commentSchema);
//hash password before saving
userSchema.pre("save", function (next) {
  const user = this;
  console.log("user before saving", this);
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(saltRound, function (saltError, salt) {
      if (saltError) {
        console.log("error generating salt");
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            console.log("error hashing");
            return next(hashError);
          }
          console.log(hash);
          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});
//passport configuration
passport.use(
  new localStrategy(function (email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//home route
app.get("/", (req, res) => {
  const ipaddress = req.remoteAddress;
  res.send("welcome to MyTeecha app backend");
  console.log(ipaddress);
});

//SIGNUP
app.post("/signup", async function (req, res) {
  const { email, fullname, password, role } = req.body;
  if (!email || !fullname || !password || !role) {
    return res.status(400).send("provide accurate information");
  }
  if (password.length <= 5) {
    console.log("short pass");
    return res.status(400).send("password fields should be greater than 5");
  }
  User.findOne({ email: email }, (err, data) => {
    if (err) {
      console.log("erro pro.. request");
      return res
        .status(500)
        .send("An error occurred trying to process your request");
    }
    if (data) {
      console.log("user exist", data);
      return res
        .status(404)
        .send("User with the specified email already exists, try logging in");
    }
    const newUser = new User({
      email,
      name: fullname,
      role,
      password,
    });
    newUser.save((err, data) => {
      if (err) {
        console.log("errror processing request");
        return res
          .status(500)
          .send("An error occurred trying to process your request");
      } else {
        res.status(200).send(data);
        console.log(data);
      }
    });
  });
});

//LOGIN
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//listener
var listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// User.deleteMany({}, (err, data) => {
//   if (err) console.error();
//   console.log(data);
// });
User.find({ email: "abzakariyya@gmail.com" }, (err, user) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(user);
  bcrypt.compare("123456", user.password, function (err, result) {
    if (result) {
      console.log("It matches!");
      console.log(user);
    } else {
      console.log("Invalid password!");
      return;
    }
  });
});
// console.clear()
