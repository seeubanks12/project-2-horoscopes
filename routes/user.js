const router = require("express").Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const req = require("express/lib/request");
// const { get } = require("express/lib/response");
// const { is } = require("express/lib/request");

router.get("/signup", (req, res) => {
  console.log("HELLO!");
  res.render("signup");
});

router.post("/signup", (req, res) => {
  let errors = [];

  if (!req.body.email) {
    res.json("You did not enter an email!");

    //res.send - same thing
  }
  if (!req.body.password) {
    res.json("You need a password!");
  }
  if (errors.length > 0) {
    res.json(errors);
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  User.create({
    email: req.body.email,
    name: req.body.name,
    sign: req.body.sign,
    password: hashedPass,
  })
    .then((createdUser) => {
      console.log("User was created", createdUser);
      req.session.user = createdUser;
      res.render("profile-page", { user: req.session.user });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
      res.json(err);
    });
});

//LOG IN
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  let errors = [];

  if (!req.body.email) {
    errors.push("You did not enter a email!");
  }
  if (!req.body.password) {
    errors.push("You need a password!");
  }
  if (errors.length > 0) {
    res.renders(errors);
  }

  User.findOne({ email: req.body.email }).then((foundUser) => {
    if (!foundUser) {
      return res.render("Email not found");
      //return since we have nested checks- the app would continue instead of saying stop here
    }

    const match = bcrypt.compareSync(req.body.password, foundUser.password);

    if (!match) {
      res.render("Incorrect password");
    }

    req.session.user = foundUser;
    console.log("user logged in");
    res.render("profile-page", { user: req.session.user });
    //user: req.session.user - user is what will be indentified in the views page.
  });
});

// router.get("/test-session", (req, res) => {
//   console.log("Req session", req.session);
//   if (req.session?.user?.username) {
//     res.json(`Hi ${req.session.user.username}!`);
//   } else {
//     res.json("You are not logged in");
//   }
// });

// router.get("/users//logout", (req, res) => {
//   req.session.destroy();
//   console.log("This is the session", req.session);
//   res.render("You are logged out");
// });

//Gets the user's profile page
router.get("/profile/:userId", (req, res) => {
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

//Update User
router.get("/:id/edit-user", (req, res, next) => {
  console.log("Hello THERE!");
  // Iteration #4: Update the drone
  // ... your code here
  User.findById(req.params.id)
    .then((foundUser) => {
      console.log("We found this user", foundUser);
      res.render("edit-user.hbs", { user: foundUser });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

router.post("/:id/edit-user", (req, res, next) => {
  // Iteration #4: Update the drone
  // ... your code here
  User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    sign: req.body.sign,
  })
    .then(() => {
      res.render("profile-page");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

//Delete Users
router.post("/:id/delete", (req, res, next) => {
  // Iteration #5: Delete the drone
  // ... your code here
  User.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/");
      console.log("User Deleted");
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

module.exports = router;
