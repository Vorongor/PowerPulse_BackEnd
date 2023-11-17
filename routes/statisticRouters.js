const express = require("express");
const router = express.Router();
const statisticController = require("./controlers/statisticController");

router.get("/", statisticController.getStatistic);

module.exports = router;
