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

module.exports = {
  getFilters,
};
