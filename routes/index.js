const router = require("express").Router();
var axios = require("axios").default;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/test", (req, res, next) => {
  var options = {
    method: "POST",
    url: "https://sameer-kumar-aztro-v1.p.rapidapi.com/",
    params: { sign: "aquarius", day: "today" },
    headers: {
      "x-rapidapi-host": "sameer-kumar-aztro-v1.p.rapidapi.com",
      "x-rapidapi-key": "967348738cmsh498a134fb7a8684p1bc711jsn0fb65b16cd49",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});
router.get("/test/:sign", (req, res, next) => {
  var options = {
    method: "POST",
    url: "https://sameer-kumar-aztro-v1.p.rapidapi.com/",
    params: { sign: req.params.sign, day: "today" },
    headers: {
      "x-rapidapi-host": "sameer-kumar-aztro-v1.p.rapidapi.com",
      "x-rapidapi-key": "967348738cmsh498a134fb7a8684p1bc711jsn0fb65b16cd49",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
