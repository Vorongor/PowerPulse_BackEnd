const { HttpError } = require("../../helpers/index");
const { User } = require("../../db/usersSchema");
const { Exercise } = require("../../db/exerciseSchema");
const { ExerciseLog } = require("../../db/exercisesLogSchema");

const getStatistic = async (req, res, next) => {
  try {
    const videos = await Exercise.countDocuments({
      gifUrl: { $exists: true, $ne: null },
    });
    const users = await User.countDocuments();
    const exercises = await ExerciseLog.countDocuments();
    const array = await ExerciseLog.find();
    let count = 0;
    let calories = 0;
    calories = array.reduce((acc, item) => acc + item.calories, 0);
    count = array.reduce((acc, item) => acc + item.time, 0);

    const finishCount = count / 60;

    if (!videos || !users || !exercises || !array) {
      throw HttpError(404, "Not found or something went wrong!");
    }

    res.json({
      status: "success",
      code: 200,
      videos: videos,
      numberOfRegistredUsers: users,
      numberOfDoneTraining: exercises,
      caloriesBurned: calories,
      hoursExercise: finishCount,
    });
  } catch (error) {
    next(error);
  }
};
// const getUsers = async (req, res, next) => {
//   try {
//     const result = await User.countDocuments();
//     if (!result) {
//       throw HttpError(404, "Not found or something went wrong!");
//     }
//     res.json({
//       status: "success",
//       code: 200,
//       users: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// const getTraining = async (req, res, next) => {
//   try {
//     const result = await ExerciseLog.countDocuments();
//     if (!result) {
//       throw HttpError(404, "Not found or something went wrong!");
//     }
//     res.json({
//       status: "success",
//       code: 200,
//       hours: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getCalories = async (req, res, next) => {
//   try {
//     const array = await ExerciseLog.find();
//     let count = 0;
//     if (!array) {
//       throw HttpError(404, "Not found or something went wrong!");
//     }
//     count = array.reduce((acc, item) => acc + item.calories, 0);

//     res.json({
//       status: "success",
//       code: 200,
//       calories: count,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const getTime = async (req, res, next) => {
//   try {
//     const array = await ExerciseLog.find();
//     let count = 0;
//     if (!array) {
//       throw HttpError(404, "Not found or something went wrong!");
//     }
//     count = array.reduce((acc, item) => acc + item.time, 0);

//     const finishCount = count / 60;

//     res.json({
//       status: "success",
//       code: 200,
//       hours: finishCount,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getStatistic,
};
