const bcrypt = require("bcrypt");
const { HttpError } = require("../../helpers/index");
const gravatar = require("gravatar");
const { User } = require("../../db/usersSchema");
const { generateToken, verifyToken } = require("../midleware/auth");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { validateUser } = require("../midleware/userValidate");
const { nanoid } = require("nanoid");
const { use } = require("../contactRoutes");
const Joi = require("joi");
const { sendVerificationEmail } = require("../midleware/sendEmail");

const tempDir = path.join(__dirname, "../", "../", "temp");
const avatarsDir = path.join(__dirname, "../", "../", "public", "avatars");

const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = validateUser({ email, password });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw HttpError(409, "Email in use");
    }
    const avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const user = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
      verificationToken,
    });
    const token = generateToken(user);

    res.status(201).json({
      token: token,
      user: {
        email: user.email,
        subscription: "starter",
        avatarURL,
        verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = validateUser({ email, password });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw HttpError(401, "Invalid credentials");
    }

    const validAccess = user.verify;

    if (validAccess !== true) {
      throw HttpError(403, "Your email not verify");
    }

    const token = generateToken(user);

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: "starter",
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      throw HttpError(401, "Token is invalid");
    }
    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(204).json({ message: "Successful Log Out" });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    const token = req.headers.authorization.split(" ")[1];

    if (!user) {
      throw HttpError(401, "Token is invalid");
    }

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        verificationToken: user.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { subscription } = req.body;

    const allowedSubscriptions = ["starter", "pro", "business"];
    if (!allowedSubscriptions.includes(subscription)) {
      throw HttpError(400, "Invalid subscription value");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatars = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { path: tempUpload, originalname } = req.file;
    const uniqueFilename = `${userId}-${Date.now()}${path.extname(
      originalname
    )}`;
    const resultUpload = path.join(avatarsDir, uniqueFilename);
    const jimpImage = await Jimp.read(tempUpload);
    jimpImage.resize(250, 250);

    await jimpImage.writeAsync(resultUpload);

    const avatarURL = `/avatars/${uniqueFilename}`;
    await fs.unlink(tempUpload);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );

    if (!user) {
      throw HttpError(404, "User not found");
    }

    res.json({
      status: "success",
      code: 200,
      data: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifiyToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const result = await User.findOneAndUpdate(
      { verificationToken },
      { $set: { verify: true, verificationToken: null } },
      { new: true }
    );

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

const userVerify = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "Missing required field email" });
    }

    const email = req.body.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify === true) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    const verificationToken = user.verificationToken;

    const emailResponse = await sendVerificationEmail(email, verificationToken);

    return res.status(200).json({
      message: "Verification email sent",
      emailSentTo: email,
      emailContent: emailResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatars,
  verifiyToken,
  userVerify,
};
