const express = require("express");
const router = express.Router();
const { passportAuthenticate } = require("./midleware/auth");
const productController = require("./controlers/productControler");

const checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw HttpError(401, "Unauthorized");
  }
  next();
};

router.use(checkToken);

router.get("/", passportAuthenticate, productController.getProducts);
router.get(
  "/current/:productId",
  passportAuthenticate,
  productController.getProductById
);
router.get(
  "/categories",
  passportAuthenticate,
  productController.getProductsCategories
);
router.get("/allowed", passportAuthenticate, productController.getAllowed);
router.get("/forbiden", passportAuthenticate, productController.getForbiden);

module.exports = router;
