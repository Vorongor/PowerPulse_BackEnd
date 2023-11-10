const bcrypt = require("bcrypt");
const { HttpError } = require("../../helpers/index");
const { User } = require("../../db/usersSchema");
const { generateToken, verifyToken } = require("../midleware/auth");

const { validateUser, validateNewUser } = require("../midleware/userValidate");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { error } = validateNewUser({ name, email, password });

    if (error) {
      throw HttpError(400, error.details[0].message);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw HttpError(409, "Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user);

    res.status(201).json({
      token: token,
      user: {
        name: user.name,
        email: user.email,
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

    const token = generateToken(user);

    res.status(200).json({
      token: token,
      userId: user._id,
      user: {
        name: user.name,
        email: user.email,
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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
