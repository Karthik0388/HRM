const express = require("express");
const { connect } = require("mongoose");
const { engine } = require("express-handlebars");
const passport = require("passport");
const Handlebars = require("handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
require("./middlewares/passport")(passport);

const { PORT, MONGODB_URL } = require("./config");
const { join } = require("path");
//import all routing module
const EmployeeRoute = require("./Route/employee");
const AuthRoute = require("./Route/auth");
const app = express();

//! ==================database connection STARTS here=======================//
let DatabaseConnection = async () => {
  await connect(MONGODB_URL);
  console.log("Database connected");
};
DatabaseConnection();
//! ==================database connection ENDS here=======================//

//? todo TEMPLATE ENGINE MIDDLEWARE STARTS HERE=============================//
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
//? todo TEMPLATE ENGINE MIDDLEWARE ENDS HERE=============================//

//?  ===========BUILT-IN MIDDLEWARE STARTS HERE=============================//
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "node_modules")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//session middleware
//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//connect flash  middleware
app.use(flash());
//?  ===========BUILT-IN MIDDLEWARE ENDS HERE=============================//

//HANDLEBARS HELPER CLASSES
Handlebars.registerHelper("trimFirst6Char", function (passedString) {
  var theString = passedString.slice(6);
  return new Handlebars.SafeString(theString);
});

//?==============set global variables===========================//
app.use(function (req, res, next) {
  res.locals.SUCCESS_MESSAGE = req.flash("SUCCESS_MESSAGE");
  res.locals.ERROR_MESSAGE = req.flash("ERROR_MESSAGE");
  res.locals.errors = req.flash("errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  let userData = req.user || null;
  res.locals.finalData = Object.create(userData);
  res.locals.username = res.locals.finalData.username;
  next();
});

app.use("/employee", EmployeeRoute);
app.use("/auth", AuthRoute);
//listen port
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`App is running on PORT number ${PORT}`);
});
