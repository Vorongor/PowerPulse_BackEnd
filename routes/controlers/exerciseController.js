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

const getListByBodyPart = async (req, res, next) => {
  try {
    const { bodyPart } = req.params;
    const result = await Exercise.find({
      bodyPart: bodyPart,
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

const getListByMusqule = async (req, res, next) => {
  try {
    const { target } = req.params;
    const result = await Exercise.find({
      target: target,
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

const getListByEquipment = async (req, res, next) => {
  try {
    const { equipment } = req.params;
    const result = await Exercise.find({
      equipment: equipment,
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
  getExercises,
  getListByBodyPart,
  getListByMusqule,
  getListByEquipment,
};
