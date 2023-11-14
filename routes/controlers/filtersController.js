const { HttpError } = require("../../helpers/index");
const { Filter } = require("../../db/filterSchema");
const { validateContact } = require("../midleware/validateBody");

const getFilters = async (req, res, next) => {
  try {
    const result = await Filter.find();

    if (!result) {
      throw HttpError(404, "Filters not Found!");
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
const getListOfBodyPart = async (req, res, next) => {
  try {
    const result = await Filter.find({
      filter: "Body parts",
    });

    if (!result) {
      throw HttpError(404, "Filters not Found! ");
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
const getListOfMuscules = async (req, res, next) => {
  try {
    const result = await Filter.find({
      filter: "Muscles",
    });

    if (!result) {
      throw HttpError(404, "Filters not Found!");
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
const getListOfEquipment = async (req, res, next) => {
  try {
    const result = await Filter.find({
      filter: "Equipment",
    });

    if (!result) {
      throw HttpError(404, "Filters not Found!");
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
  getFilters,
  getListOfBodyPart,
  getListOfMuscules,
  getListOfEquipment,
};
