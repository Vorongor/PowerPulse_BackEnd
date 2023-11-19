const { HttpError } = require("../../helpers/index");
const { User } = require("../../db/usersSchema");
const {
  validateUserParams,
  validateUserChangeParams,
  sanitizeUser,
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

const calculateBMR = (sex, currentWeight, height, age, levelActivity) => {
  const sportIndex = { 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9 };

  if (sex === "male") {
    return Math.round(
      (10 * currentWeight + 6.25 * height - 5 * age + 5) *
        sportIndex[levelActivity]
    );
  }

  if (sex === "female") {
    return Math.round(
      (10 * currentWeight + 6.25 * height - 5 * age - 161) *
        sportIndex[levelActivity]
    );
  }

  return null;
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

    const bmr = calculateBMR(sex, currentWeight, height, age, levelActivity);

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
        bmr,
        fullInfoCompleated: true,
      },
      { new: true }
    );

    if (!user) {
      throw HttpError(404, "Can`t find current user, check your authorisation");
    }

    res.json({
      status: "User info has been successfully added",
      code: 201,
      user: sanitizeUser(user),
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
      req.body,
      { new: true }
    );
    if (!result) {
      throw HttpError(
        404,
        "Can't change user information, check your authorisation"
      );
    }

    const thenUser = await User.findById(userId);
    const { sex, currentWeight, height, birthday, levelActivity } = thenUser;

    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();

    const bmr = calculateBMR(sex, currentWeight, height, age, levelActivity);
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      { bmr: bmr },
      { new: true }
    );

    const currentUser = await User.findById(userId);

    res.status(201).json({
      message: "User information has been updated",
      user: sanitizeUser(currentUser),
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
      throw HttpError(401, "Token is invalid, check your authorisation");
    }
    const currentUser = await User.findById(userId);

    res.status(201).json({
      status: "success",
      code: 201,
      user: sanitizeUser(currentUser),
    });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const bucketName = "pover_pulse_bucket";
    const fileName = `avatars/${req.file.originalname}`;
    const [fileUpload] = await storage
      .bucket(bucketName)
      .upload(req.file.path, {
        destination: fileName,
        predefinedAcl: "publicRead",
      });

    if (!fileUpload) {
      throw HttpError(
        404,
        "Can't upload user avatar, check your authorisation"
      );
    }

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { avatarUrl: publicUrl });

    if (!user) {
      throw HttpError(404, "Can't update user avatar, user not found");
    }

    const currentUser = await User.findById(userId);

    res.json({
      status: "Successfully upload user avatar",
      code: 201,
      user: sanitizeUser(currentUser),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
  changeUser,
  getCurrentUser,
  uploadAvatar,
};
