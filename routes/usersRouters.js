const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const userController = require("./controlers/userControler");
const { upload } = require("./midleware/upload");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/current", passportAuthenticate, userController.getCurrentUser);
router.patch("/", passportAuthenticate, userController.updateSubscription);
router.patch(
  "/avatars",
  passportAuthenticate,
  upload.single("avatar"),
  userController.updateAvatars
);
router.post("/verify", userController.userVerify);
module.exports = router;
