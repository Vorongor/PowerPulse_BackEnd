const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const productController = require("./controlers/productControler");

// const checkToken = (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];
//   if (!token) {
//     throw HttpError(401, "Unauthorized");
//   }
//   next();
// };

// router.use(checkToken);

router.get("/", productController.getProducts);
router.get("/categories", productController.getProductsCategories);
// router.get("/:contactId", passportAuthenticate, contactController.getContact);
// router.post("/", passportAuthenticate, contactController.createContact);
// router.delete(
//   "/:contactId",
//   passportAuthenticate,
//   contactController.deleteContact
// );
// router.put(
//   "/:contactId",
//   passportAuthenticate,
//   contactController.updateContact
// );
// router.patch(
//   "/:contactId/favorite",
//   passportAuthenticate,
//   contactController.updateContactFavorite
// );

module.exports = router;
