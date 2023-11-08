const express = require("express");
const router = express.Router();
const userController = require("./controlers/userControler");

router.get("/:verificationToken", userController.verifiyToken);

module.exports = router;
