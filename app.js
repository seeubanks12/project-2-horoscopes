// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

const User = require("./models/User.model");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.use((req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id).then((user) => {
      req.app.locals.globalUser = user;
      next();
    });
  } else {
    next();
  }
});

const projectName = "project-2-horoscopes";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = "Horoscopes";

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 600000,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/horoscopes",
      ttl: 600000,
    }),
  })
);

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);


const log = require("./routes/log");
app.use("/log", log);

const user = require("./routes/user");
app.use("/user", user);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
