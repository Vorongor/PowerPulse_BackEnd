const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const userController = require("./controlers/userControler");
const authController = require("./controlers/authController");
const { upload } = require("./midleware/upload");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.put("/update", passportAuthenticate, userController.updateUser);
// router.patch("/", passportAuthenticate, userController.updateSubscription);
// router.patch(
//   "/avatars",
//   passportAuthenticate,
//   upload.single("avatar"),
//   userController.updateAvatars
// );
// router.post("/verify", userController.userVerify);
router.get("/", userController.checkIn);
module.exports = router;
