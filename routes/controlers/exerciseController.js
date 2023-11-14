const { HttpError } = require("../../helpers/index");
const { Exercise } = require("../../db/exerciseSchema");

const getExercises = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;

    const startIndex = (page - 1) * pageSize;

    const result = await Exercise.find().skip(startIndex).limit(pageSize);

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

    if (!result.length) {
      throw HttpError(
        404,
        `Exercises for the specified body part '${bodyPart}' not found`
      );
    }
    res.json({
      status: `Exercises for the specified body part '${bodyPart}'`,
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

    if (!result.length) {
      throw HttpError(
        404,
        `Exercises for the specified by muscule '${target}' not found`
      );
    }
    res.json({
      status: `Exercises for the specified by muscule '${target}'`,
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

    if (!result.length) {
      throw HttpError(
        404,
        `Exercises for the specified by equipment '${equipment}' not found`
      );
    }
    res.json({
      status: `Exercises for the specified by equipment '${equipment}'`,
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const getExerciseById = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const result = await Exercise.findById(exerciseId);

    if (!result) {
      throw HttpError(404, `Exercises not found`);
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
  getExerciseById,
};
