const router = require("express").Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const isLoggedIn = require("../middleware/isLoggedIn");

//This pulls up the create log form
router.get("/daily-logs/create-log", (req, res) => {
  console.log("Hello World");
  res.render("daily-logs/create-log");
});

//This saves a new log in the database
router.post("/create-log", isLoggedIn, (req, res) => {
  console.log("HELLLLLO");
  // User.findById(req.params.userId).then((foundUser) => {
  Log.create({
    date: req.body.date,
    mood: req.body.mood,
    content: req.body.content,
    creatorId: req.user._id,
  })
    .then((newLog) => {
      console.log("A new log was created", newLog);
      res.redirect(`/log/${req.user._id}/all-logs`);
      // res.redirect("daily-logs/all-logs");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
  // });
});

//This pulls all logs from a database
router.get("/:userId/all-logs", (req, res) => {
  console.log("HEELLLOOOO AGAINNNNN");
  Log.find({ creatorId: req.params.userId })
    .sort({ createdAt: -1 })
    .populate("creatorId")
    .then((allLogs) => {
      console.log("All logs", allLogs);
      res.render("daily-logs/all-logs", { logs: allLogs });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Update Logs
router.get("/edit-log", (req, res, next) => {
  console.log("Hello THERE!");
  // Iteration #4: Update the drone
  // ... your code here
  Log.findById(req.params.id)
    .then((foundLog) => {
      console.log("We found this user");
      res.render("edit-log.hbs", { log: foundLog });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

router.post("/edit-log", (req, res, next) => {
  // Iteration #4: Update the drone
  // ... your code here
  Log.findByIdAndUpdate(req.params.id, {
    date: req.body.date,
    mood: req.body.mood,
    content: req.body.content,
  })
    .then((allLogs) => {
      res.render("daily-logs/all-logs", { logs: allLogs });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Delete Logs
router.post("/log/delete", (req, res, next) => {
  // Iteration #5: Delete the drone
  // ... your code here
  Log.findByIdAndRemove(req.params.id)
    .then((allLogs) => {
      res.render("daily-logs/all-logs", { logs: allLogs });
      console.log("Post Deleted");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
