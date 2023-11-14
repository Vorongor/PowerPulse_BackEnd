const { HttpError } = require("../../helpers/index");
const { User } = require("../../db/usersSchema");
const { Exercise } = require("../../db/exerciseSchema");
const { ExerciseLog } = require("../../db/exercisesLogSchema");

const getVideo = async (req, res, next) => {
  try {
    const result = await Exercise.countDocuments({
      gifUrl: { $exists: true, $ne: null },
    });
    if (!result) {
      throw HttpError(404, "Not found or something went wrong!");
    }

    res.json({
      status: "success",
      code: 200,
      videos: result,
    });
  } catch (error) {
    next(error);
  }
};
const getUsers = async (req, res, next) => {
  try {
    const result = await User.countDocuments();
    if (!result) {
      throw HttpError(404, "Not found or something went wrong!");
    }
    res.json({
      status: "success",
      code: 200,
      users: result,
    });
  } catch (error) {
    next(error);
  }
};
const getTraining = async (req, res, next) => {
  try {
    const result = await ExerciseLog.countDocuments();
    if (!result) {
      throw HttpError(404, "Not found or something went wrong!");
    }
    res.json({
      status: "success",
      code: 200,
      hours: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCalories = async (req, res, next) => {
  try {
    const array = await ExerciseLog.find();
    let count = 0;
    if (!array) {
      throw HttpError(404, "Not found or something went wrong!");
    }
    count = array.reduce((acc, item) => acc + item.calories, 0);

    res.json({
      status: "success",
      code: 200,
      calories: count,
    });
  } catch (error) {
    next(error);
  }
};
const getTime = async (req, res, next) => {
  try {
    const array = await ExerciseLog.find();
    let count = 0;
    if (!array) {
      throw HttpError(404, "Not found or something went wrong!");
    }
    count = array.reduce((acc, item) => acc + item.time, 0);

    const finishCount = count / 60;

    res.json({
      status: "success",
      code: 200,
      hours: finishCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideo,
  getCalories,
  getUsers,
  getTime,
  getTraining,
};
