const express = require("express");
const router = express.Router();
const statisticController = require("./controlers/statisticController");

router.get("/video", statisticController.getVideo);
router.get("/calories", statisticController.getCalories);
router.get("/users", statisticController.getUsers);
router.get("/time", statisticController.getTime);
router.get("/training", statisticController.getTraining);

module.exports = router;
