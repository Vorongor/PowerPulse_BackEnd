const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const exerciseController = require("./controlers/exerciseController");
const { upload } = require("./midleware/upload");

// router.post("/register", userController.registerUser);
// router.post("/login", userController.loginUser);
// router.post("/logout", userController.logoutUser);
// router.get("/current", passportAuthenticate, userController.getCurrentUser);
// router.patch("/", passportAuthenticate, userController.updateSubscription);
// router.patch(
//   "/avatars",
//   passportAuthenticate,
//   upload.single("avatar"),
//   userController.updateAvatars
// );
// router.post("/verify", userController.userVerify);
router.get("/", exerciseController.getExercises);
module.exports = router;
