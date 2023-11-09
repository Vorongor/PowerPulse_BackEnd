const { HttpError } = require("../../helpers/index");
const { Exercise } = require("../../db/exerciseSchema");
const { validateContact } = require("../midleware/validateBody");


const getExercises = async (req, res, next) => {
  try {
    const result = await Exercise.find();

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
  getExercises,
};
