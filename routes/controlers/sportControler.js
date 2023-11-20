const { HttpError } = require("../../helpers/index");
const { ExerciseLog } = require("../../db/exercisesLogSchema");
const { FoodLog } = require("../../db/foodLogSchema");
const { Exercise } = require("../../db/exerciseSchema");
const { validateExercise } = require("../midleware/validateBody");
const { format } = require("date-fns");

const updateExercise = async (req, res, next) => {
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

    const exercise = await Exercise.findById(exerciseId);

    const result = await ExerciseLog.create({
      exercise: exercise._id,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      name: exercise.name,
      target: exercise.target,
      date: formattedDate,
      time,
      calories,
      owner: userId,
    });
    if (!result) {
      throw HttpError(400, "Somethin went wrong");
    }

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
    if (!deletedExercise) {
      throw HttpError(
        404,
        "Cant`t find that done exercise, or you not the owner"
      );
    }

    res.status(200).json({
      status: "success",
      code: 200,
      deletedExercise,
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    const userId = req.user._id;
    if (!date) {
      throw HttpError(400, "Date parameter is required");
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      throw HttpError(400, "Invalid date format. Please use MM/DD/YYYY");
    }
    const result = await ExerciseLog.find({
      date: date,
      owner: userId,
    });
    if (!result.length) {
      throw HttpError(404, "Exercises logs not found for the specified date");
    }

    res.status(200).json({
      status: `List of done exercises in ${date}`,
      code: 200,
      data: result,
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
module.exports = {
  updateExercise,
  removeExercise,
  getExerciseByDate,
  getExerciseFoodByDate,
};
