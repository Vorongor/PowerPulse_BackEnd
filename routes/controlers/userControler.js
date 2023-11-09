const bcrypt = require("bcrypt");
const { HttpError } = require("../../helpers/index");
const gravatar = require("gravatar");
const { User } = require("../../db/usersSchema");
const { validateUserParams } = require("../midleware/userValidate");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { validateUser } = require("../midleware/userValidate");
const { nanoid } = require("nanoid");
const { use } = require("../productsRouters");
const Joi = require("joi");
const { sendVerificationEmail } = require("../midleware/sendEmail");

const tempDir = path.join(__dirname, "../", "../", "temp");
const avatarsDir = path.join(__dirname, "../", "../", "public", "avatars");

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
    const bmr = (10 * currentWeight + 6.25 * height - 5 * age + 5) * sportIndex;
  }
  if (sex === "female") {
    // Для жінок:
    // BMR = (10 * поточна вага (кг) + 6,25 * зріст (см) - 5 * вік (роки) - 161) * коефіцієнт по способу життя
    const bmr =
      (10 * currentWeight + 6.25 * height - 5 * age - 161) * sportIndex;
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
    // const dailyExerciseTime = 110;

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
      code: 200,
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

    res.status(200).json({
      status: "success",
      code: 200,
      user: currentUser,
    });
  } catch (error) {
    next(error);
  }
};

// const updateSubscription = async (req, res, next) => {
//   try {
//     const userId = req.user._id;
//     const { subscription } = req.body;

//     const allowedSubscriptions = ["starter", "pro", "business"];
//     if (!allowedSubscriptions.includes(subscription)) {
//       throw HttpError(400, "Invalid subscription value");
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { subscription },
//       { new: true }
//     );

//     if (!user) {
//       throw HttpError(404, "User not found");
//     }

//     res.json({
//       status: "success",
//       code: 200,
//       data: {
//         email: user.email,
//         subscription: user.subscription,
//         avatarURL: user.avatarURL,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const updateAvatars = async (req, res, next) => {
//   try {
//     const userId = req.user._id;

//     const { path: tempUpload, originalname } = req.file;
//     const uniqueFilename = `${userId}-${Date.now()}${path.extname(
//       originalname
//     )}`;
//     const resultUpload = path.join(avatarsDir, uniqueFilename);
//     const jimpImage = await Jimp.read(tempUpload);
//     jimpImage.resize(250, 250);

//     await jimpImage.writeAsync(resultUpload);

//     const avatarURL = `/avatars/${uniqueFilename}`;
//     await fs.unlink(tempUpload);

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { avatarURL },
//       { new: true }
//     );

//     if (!user) {
//       throw HttpError(404, "User not found");
//     }

//     res.json({
//       status: "success",
//       code: 200,
//       data: {
//         email: user.email,
//         subscription: user.subscription,
//         avatarURL: user.avatarURL,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const verifiyToken = async (req, res, next) => {
//   try {
//     const { verificationToken } = req.params;
//     const result = await User.findOneAndUpdate(
//       { verificationToken },
//       { $set: { verify: true, verificationToken: null } },
//       { new: true }
//     );

//     if (!result) {
//       throw HttpError(404, "Not Found!");
//     }
//     res.json({
//       status: "success",
//       code: 200,
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const userVerify = async (req, res, next) => {
//   try {
//     const schema = Joi.object({
//       email: Joi.string().email().required(),
//     });

//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ message: "Missing required field email" });
//     }

//     const email = req.body.email;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.verify === true) {
//       return res
//         .status(400)
//         .json({ message: "Verification has already been passed" });
//     }

//     const verificationToken = user.verificationToken;

//     const emailResponse = await sendVerificationEmail(email, verificationToken);

//     return res.status(200).json({
//       message: "Verification email sent",
//       emailSentTo: email,
//       emailContent: emailResponse,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const checkIn = (req, res) => {
  try {
    return res.status(200).json({
      message: "Conect is deployed!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
  updateUser,
  getCurrentUser,
  // updateSubscription,
  // updateAvatars,
  // verifiyToken,
  // userVerify,
  checkIn,
};
