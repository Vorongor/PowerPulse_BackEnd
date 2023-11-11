const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const statisticController = require("./controlers/statisticController");

const checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw HttpError(401, "Unauthorized");
  }
  next();
};

router.use(checkToken);

router.get("/video", passportAuthenticate, statisticController.getVideo);
router.get("/calories", passportAuthenticate, statisticController.getCalories);
router.get("/users", passportAuthenticate, statisticController.getUsers);
router.get("/time", passportAuthenticate, statisticController.getTime);
router.get("/training", passportAuthenticate, statisticController.getTraining);

module.exports = router;
