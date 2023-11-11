const { HttpError } = require("../../helpers/index");
const { ExerciseLog } = require("../../db/exercisesLogSchema");
const { FoodLog } = require("../../db/foodLogSchema");
const { validateExercise } = require("../midleware/validateBody");
const { format } = require("date-fns");

const updateExersise = async (req, res, next) => {
  try {
    const { exerciseId, time, calories, date } = req.body;
    const userId = req.user._id;
    let logDate;
    if (date) {
      logDate = new Date(date);
    } else {
      logDate = new Date();
    }
    const formattedDate = format(logDate, "dd/MM/yyyy");

    const { error } = validateExercise({ time, calories });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const result = await ExerciseLog.create({
      exercise: exerciseId,
      date: formattedDate,
      time,
      calories,
      owner: userId,
    });

    res.json({
      status: "success",
      code: 200,
      result,
    });
  } catch (error) {
    next(error);
  }
};

const removeExercise = async (req, res, next) => {
  try {
    const { exerciseId } = req.params;
    const userId = req.user._id;
    const deletedExercise = await ExerciseLog.findOneAndRemove({
      _id: exerciseId,
      owner: userId,
    });

    res.status(200).json({
      status: "success",
      code: 200,
      deletedExercise,
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseFoodByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    const foods = await FoodLog.find({
      date: date,
      owner: userId,
    });
    const exercises = await ExerciseLog.find({
      date: date,
      owner: userId,
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        foods,
        exercises,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;

    const result = await ExerciseLog.find({
      date: date,
      owner: userId,
    });

    res.status(200).json({
      status: "success",
      code: 200,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  updateExersise,
  removeExercise,
  getExerciseByDate,
  getExerciseFoodByDate,
};
