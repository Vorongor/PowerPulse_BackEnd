const fs = require("fs").promises;
const path = require("path");
const { HttpError } = require("../../helpers/index");
const { Product } = require("../../db/productSchema");

const filePath = path.join(
  __dirname,
  "../",
  "../",
  "db",
  "productsCategories.json"
);

const getProducts = async (req, res, next) => {
  try {
    const result = await Product.find();

    if (!result) {
      throw HttpError(404, "Not Found!");
    }
    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsCategories = async (req, res, next) => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const result = JSON.parse(fileContent);

    if (!result) {
      throw HttpError(404, "Not Found!");
    }
    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllowed = async (req, res, next) => {
  try {
    const { blood } = req.body;

    const validBloodGroups = [1, 2, 3, 4];
    if (!validBloodGroups.includes(blood)) {
      throw HttpError(400, "Invalid blood group");
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: false,
    });

    if (!result) {
      throw HttpError(404, "Not Found!");
    }

    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getForbiden = async (req, res, next) => {
  try {
    const { blood } = req.body;

    const validBloodGroups = [1, 2, 3, 4];
    if (!validBloodGroups.includes(blood)) {
      throw HttpError(400, "Invalid blood group");
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: true,
    });

    if (!result) {
      throw HttpError(404, "Not Found!");
    }

    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await Product.findById(productId);

    if (!result) {
      throw HttpError(404, "Not Found!");
    }
    res.json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsCategories,
  getAllowed,
  getForbiden,
  getProductById,
};
