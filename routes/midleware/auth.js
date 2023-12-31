const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const { User } = require("../../db/usersSchema");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

// Set up Passport JWT strategy
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secretKey,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, function (payload, done) {
    User.findById(payload.userId)
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch((err) => done(err, false));
  })
);

// Function to generate a JWT token
const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "7h" });
  return token;
};
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: "7d",
  });
  return refreshToken;
};

// Function to verify a JWT token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
};
const verifyRefreshToken = (refreshToken) => {
  try {
    const decodedToken = jwt.verify(refreshToken, secretKey);
    return decodedToken;
  } catch (error) {
    console.error(error);  // Вивести помилку для додаткового аналізу
    return null;
  }
};

module.exports = {
  passportAuthenticate: passport.authenticate("jwt", { session: false }),
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};
