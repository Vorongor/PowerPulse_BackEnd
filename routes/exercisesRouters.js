const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const exerciseController = require("./controlers/exerciseController");
const filtersController = require("./controlers/filtersController");

router.get("/", passportAuthenticate, exerciseController.getExercises);
router.get("/filters", passportAuthenticate, filtersController.getFilters);
router.get("/bodyParts", passportAuthenticate, filtersController.getFilters);
router.get("/muscules", passportAuthenticate, filtersController.getFilters);
router.get("/equipments", passportAuthenticate, filtersController.getFilters);

module.exports = router;
