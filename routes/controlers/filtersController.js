const { HttpError } = require("../../helpers/index");
const { Filter } = require("../../db/filterSchema");
const { validateContact } = require("../midleware/validateBody");

const getFilters = async (req, res, next) => {
  try {
    const result = await Filter.find();

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
const getFiltersBodyPart = async (req, res, next) => {
  try {
    const result = await Filter.find({
      filter: "Body parts",
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
const getFiltersMuscules = async (req, res, next) => {
  try {
    const part = req.body;
    const result = await Filter.find({
      name: part,
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
const getFiltersEquipment = async (req, res, next) => {
  try {
    const result = await Filter.find({
      filter: "Equipment",
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

module.exports = {
  getFilters,
};
