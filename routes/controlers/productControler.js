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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;

    const startIndex = (page - 1) * pageSize;

    const result = await Product.find().skip(startIndex).limit(pageSize);

    if (!result) {
      throw HttpError(404, "Can't get list of product");
    }
    res.json({
      status: "List Of products default 50 items",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getProductsByQuery = async (req, res, next) => {
  try {
    const search = req.query.search;
    const category = req.query.category;
    const blood = parseInt(req.query.blood);

    const query = {};
    if (search) query.title = { $regex: new RegExp(search, "i") };
    if (category) query.category = category;
    if (blood) query[`groupBloodNotAllowed.${blood}`] = false;

    const result = await Product.find(query);

    if (!result) {
      throw HttpError(404, "Can't get list of product");
    }

    if (result.length === 0) {
      return res.status(404).json({
        status: `No products found with the specified parameters: title:${search}, category:${category}, blood:${blood}`,
        code: 404,
        data: [],
      });
    }
    res.json({
      status: `List Of products by serch:title:${search}, category:${category}, blood:${blood}`,
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
      status: "List Of products categories",
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
      throw HttpError(
        400,
        "Invalid blood group, it should be number one of 1,2,3,4"
      );
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: false,
    });

    if (!result) {
      throw HttpError(404, "Not Found!");
    }

    res.json({
      status: "List of allowed products",
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
      throw HttpError(
        400,
        "Invalid blood group, it should be number one of 1,2,3,4"
      );
    }

    const result = await Product.find({
      [`groupBloodNotAllowed.${blood}`]: true,
    });

    if (!result) {
      throw HttpError(404, "Not Found!");
    }

    res.json({
      status: "List of forbiden products",
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
      throw HttpError(404, "Not Found product by that id");
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
  getProductsByQuery,
};
