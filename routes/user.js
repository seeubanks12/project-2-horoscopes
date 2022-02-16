const router = require("express").Router();
const User = require("../models/User.model");
const Log = require("../models/Log.model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const aztroJs = require("aztro-js");
const isLoggedIn = require("../middleware/isLoggedIn");
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
      req.app.locals.globalUser = createdUser;
      req.session.user = createdUser;
      res.redirect(`/user/${createdUser._id}/profile-page`);
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
    req.app.locals.globalUser = foundUser;
    req.session.user = foundUser;
    console.log("user logged in");
    // res.render("profile-page", { user: req.session.user });
    res.redirect(`/user/${foundUser._id}/profile-page`);
    //user: req.session.user - user is what will be indentified in the views page.
  });
});

router.get("/test-session", (req, res) => {
  console.log("Req session", req.session);
  if (req.session?.user?.name) {
    res.json(`Hi ${req.session.user.name}!`);
  } else {
    res.json("You are not logged in");
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.app.locals.globalUser = null;
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("user/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

//Gets the user's profile page
router.get("/:userId/profile-page", (req, res) => {
  User.findById(req.params.userId).then((foundUser) => {
    Log.find({ creatorId: req.params.userId })
      .then((foundLogs) => {
        aztroJs.getTodaysHoroscope(foundUser.sign, function (horoscope) {
          console.log(horoscope);
          res.render("profile-page", {
            user: foundUser,
            logs: foundLogs,
            horoscope,
          });
        });
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  });
});

//Update User
router.get("/:id/edit-user", (req, res, next) => {
  // console.log("Hello THERE!");
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
    .then((updatedUser) => {
      res.redirect(`/user/${updatedUser._id}/profile-page`);
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
