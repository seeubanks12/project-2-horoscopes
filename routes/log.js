const router = require("express").Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//This pulls up the create tweet form
router.get("/daily-logs/create-log", (req, res) => {
  console.log("Hello World");
  res.render("daily-logs/create-log");
});

//This saves a new tweet in the database
router.post("/daily-logs/create-log", isLoggedIn, (req, res) => {
  Log.create({
    date: req.body.date,
    content: req.body.content,
    creatorId: req.user._id,
  })
    .then((newLog) => {
      console.log("A new log was created", newLog);
      res.redirect("daily-logs/all-logs");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//This pulls all tweets from a database
router.get("/daily-logs/all-logs", (req, res) => {
  Log.find()
    .populate("creatorId")
    .then((allLogs) => {
      console.log("All logs", allLogs);
      res.render("daily-logs/all-logs", { logs: allLogs });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
