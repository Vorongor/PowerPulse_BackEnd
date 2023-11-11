const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const exerciseController = require("./controlers/exerciseController");
const filtersController = require("./controlers/filtersController");

router.get("/", passportAuthenticate, exerciseController.getExercises);
router.get("/filters", passportAuthenticate, filtersController.getFilters);
router.get(
  "/:exerciseId",
  passportAuthenticate,
  exerciseController.getExerciseById
);
router.get(
  "/bodyParts",
  passportAuthenticate,
  filtersController.getListOfBodyPart
);
router.get(
  "/bodyParts/:bodyPart",
  passportAuthenticate,
  exerciseController.getListByBodyPart
);
router.get(
  "/muscules",
  passportAuthenticate,
  filtersController.getListOfMuscules
);
router.get(
  "/muscules/:target",
  passportAuthenticate,
  exerciseController.getListByMusqule
);
router.get(
  "/equipments",
  passportAuthenticate,
  filtersController.getListOfEquipment
);
router.get(
  "/equipments/:equipment",
  passportAuthenticate,
  exerciseController.getListByEquipment
);

module.exports = router;
