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
  models = require("./db"),
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

//passport configuration
passport.use(
  new localStrategy(function (email, password, done) {
    models.User.findOne({ email: email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!bcrypt.compareSync(password, user.password)) {
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
  models.User.findById(id, function (err, user) {
    done(err, user);
  });
});

//home route
const home = require("./routes/home");
app.get("/", home);

//SIGNUP
const signup = require("./routes/signup");
app.post("/signup", signup);

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
