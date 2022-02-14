const router = require("express").Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");

//Gets the user's profile pag
router.get("/profile/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then((foundUser) => {
      Log.find({ creatorId: req.params.userId })
        .then((foundLogs) => {
          console.log("Found all of the daily logs", foundLogs);
          res.render("profile-page", { user: foundUser, logs: foundLogs });
        })
        .catch((err) => {
          console.log("Something went wrong", err);
        });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
