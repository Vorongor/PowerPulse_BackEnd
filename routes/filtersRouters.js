const express = require("express");
const router = express.Router();
const filtersController = require("./controlers/filtersController");

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

router.get("/", filtersController.getFilters);
module.exports = router;
