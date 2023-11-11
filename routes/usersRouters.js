const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const userController = require("./controlers/userControler");
const authController = require("./controlers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.put("/update", passportAuthenticate, userController.updateUser);
router.patch("/update", passportAuthenticate, userController.updateUser);
router.get("/current", passportAuthenticate, userController.getCurrentUser);


router.get("/", userController.checkIn);
module.exports = router;
