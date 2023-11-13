const { HttpError } = require("../../helpers/index");
const { User } = require("../../db/usersSchema");
const {
  validateUserParams,
  validateUserChangeParams,
} = require("../midleware/userValidate");
const { Storage } = require("@google-cloud/storage");
const path = require("path");

const keyFilePath = path.resolve(
  __dirname,
  "..",
  "..",
  "db",
  "woven-victor-404921-72cbf39ee2ce.json"
);

const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: "woven-victor-404921",
});

const uploadAvatar = async (req, res, next) => {
  try {
    const bucketName = "pover_pulse_bucket";
    const fileName = `avatars/${req.file.originalname}`;
    const fileUpload = await storage.bucket(bucketName).upload(req.file.path, {
      destination: fileName,
      predefinedAcl: "publicRead", // Set predefinedAcl to 'publicRead' for public access
    });

    // Get the public URL of the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(userId, {
      avatrUrl: publicUrl,
    });
    const currentUser = await User.findById(userId);

    // Respond with the public URL or any other relevant information
    res.json({ status: "success", code: 201, user: currentUser });
  } catch (error) {
    next(error);
  }
};
// Розрахунок денної норми калорій
const calculateDailyCalories = (
  height,
  currentWeight,
  desiredWeight,
  age,
  blood,
  sex,
  levelActivity
) => {
  const sportIndex = (levelActivity) => {
    const activityMap = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };

    return activityMap[levelActivity] || null;
  };

  let bmr;

  if (sex === "male") {
    //     Для чоловіків:
    // BMR = (10 * поточна вага (кг) + 6,25 * зріст (см) - 5 * вік (роки) + 5) * коефіцієнт по способу життя
    const bmr =
      (10 * currentWeight + 6.25 * height - 5 * age + 5) *
      sportIndex(levelActivity);
  }
  if (sex === "female") {
    // Для жінок:
    // BMR = (10 * поточна вага (кг) + 6,25 * зріст (см) - 5 * вік (роки) - 161) * коефіцієнт по способу життя
    const bmr =
      (10 * currentWeight + 6.25 * height - 5 * age - 161) *
      sportIndex(levelActivity);
  }
  return bmr;
};

const updateUser = async (req, res, next) => {
  try {
    const {
      height,
      currentWeight,
      desiredWeight,
      birthday,
      blood,
      sex,
      levelActivity,
    } = req.body;
    const userId = req.user._id;

    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();

    const { error } = validateUserParams({
      height,
      currentWeight,
      desiredWeight,
      birthday,
      blood,
      sex,
      levelActivity,
    });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const dailyCalories = calculateDailyCalories(
      height,
      currentWeight,
      desiredWeight,
      age,
      blood,
      sex,
      levelActivity
    );

    const user = await User.findByIdAndUpdate(
      userId,
      {
        height,
        currentWeight,
        desiredWeight,
        age,
        blood,
        sex,
        levelActivity,
        dailyCalories,
      },
      { new: true }
    );

    res.json({
      status: "success",
      code: 201,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const token = req.headers.authorization.split(" ")[1];

    if (!user) {
      throw HttpError(401, "Token is invalid");
    }
    const currentUser = await User.findById(userId);

    storage.getBuckets("pover_pulse_bucket").then(() => console.log(storage));
    res.status(201).json({
      status: "success",
      code: 201,
      user: currentUser,
    });
  } catch (error) {
    next(error);
  }
};

const checkIn = (req, res, next) => {
  try {
    return res.status(200).json({
      message: "Conect is deployed!",
    });
  } catch (error) {
    next(error);
  }
};

const changeUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { error } = validateUserChangeParams(req.body);

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const result = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      req.body
    );

    if (!result) {
      throw HttpError(404, "can't change user information");
    }

    const currentUser = await User.findById(userId);

    res.status(201).json({
      status: "success",
      message: "user information has been updated",
      user: currentUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
  changeUser,
  getCurrentUser,
  checkIn,
  uploadAvatar,
};
