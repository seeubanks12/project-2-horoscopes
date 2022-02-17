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
const SpotifyWebApi = require("spotify-web-api-node");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

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

app.locals.title = "spacelestial";

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

// app.get("/playlist/:playlistId", (req, res) = {
// spotifyApi.getPlaylist('5ieJqeLJjjI8iJWaxeBLuK')
//   .then(function(data) {
//     console.log('Some information about this playlist', data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   })
// });

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
