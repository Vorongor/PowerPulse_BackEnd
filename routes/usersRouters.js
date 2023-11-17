const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const userController = require("./controlers/userControler");
const authController = require("./controlers/authController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", passportAuthenticate, authController.logoutUser);
router.post("/refresh", authController.refreshUser);
router.put("/update", passportAuthenticate, userController.updateUser);
router.patch("/update", passportAuthenticate, userController.changeUser);
router.get("/current", passportAuthenticate, userController.getCurrentUser);
router.post(
  "/avatar/upload",
  passportAuthenticate,
  upload.single("avatar"),
  userController.uploadAvatar
);

module.exports = router;
