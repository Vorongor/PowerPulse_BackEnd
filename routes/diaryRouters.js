const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const foodController = require("./controlers/foodControler");
const sportController = require("./controlers/sportControler");
const { upload } = require("./midleware/upload");

router.post("/food", passportAuthenticate, foodController.updateFood);
router.post("/exercise", passportAuthenticate, sportController.updateExersise);
router.delete("/food/:foodId", passportAuthenticate, foodController.removeFood);
router.delete(
  "/exercise/:exerciseId",
  passportAuthenticate,
  sportController.removeExercise
);
router.get("/food/", passportAuthenticate, foodController.getFoodByDate);
router.get(
  "/exercise/",
  passportAuthenticate,
  sportController.getExerciseByDate
);
router.get("/", passportAuthenticate, sportController.getExerciseFoodByDate);

// router.get("/", userController.checkIn);
module.exports = router;
