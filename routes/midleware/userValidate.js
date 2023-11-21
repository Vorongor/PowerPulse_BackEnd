const Joi = require("joi");

const customMessages = {
  "string.base": "{#label} повинно бути текстом",
  "string.empty": "{#label} не може бути пустим",
  "string.email": "{#label} повинно бути дійсною електронною адресою",
  "string.min": "{#label} повинно містити принаймні {#limit} символів",
  "number.base": "{#label} повинно бути числом",
  "number.min": "{#label} повинно бути не менше {#limit}",
  "date.base": "{#label} повинно бути дійсною датою",
  "date.max": "{#label} повинно бути не пізніше поточної дати",
  "any.invalid": "{#label} має бути старше 18 років",
};

const validateNewUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages(customMessages),
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(6).required().messages(customMessages),
  });
  return schema.validate(data, { abortEarly: false });
};

const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages(customMessages),
    password: Joi.string().min(6).required().messages(customMessages),
  });
  return schema.validate(data, { abortEarly: false });
};

const validateUserParams = (data) => {
  const schema = Joi.object({
    height: Joi.number().min(150).required().messages(customMessages),
    currentWeight: Joi.number().min(35).required().messages(customMessages),
    desiredWeight: Joi.number().min(35).required().messages(customMessages),
    birthday: Joi.date()
      .max("now")
      .iso()
      .required()
      .messages(customMessages)
      .custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "must be older than 18 years"),
    blood: Joi.number().valid(1, 2, 3, 4).required().messages(customMessages),
    sex: Joi.string()
      .valid("male", "female")
      .required()
      .messages(customMessages),
    levelActivity: Joi.number()
      .valid(1, 2, 3, 4, 5)
      .required()
      .messages(customMessages),
  });

  return schema.validate(data, { abortEarly: false });
};

const validateUserChangeParams = (data) => {
  const schema = Joi.object({
    name: Joi.string().messages(customMessages),
    email: Joi.string().email().messages(customMessages),
    height: Joi.number().min(150).messages(customMessages),
    currentWeight: Joi.number().min(35).messages(customMessages),
    desiredWeight: Joi.number().min(35).messages(customMessages),
    birthday: Joi.date()
      .max("now")
      .iso()

      .messages(customMessages)
      .custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "must be older than 18 years"),
    blood: Joi.number().valid(1, 2, 3, 4).messages(customMessages),
    sex: Joi.string()
      .valid("male", "female")

      .messages(customMessages),
    levelActivity: Joi.number()
      .valid(1, 2, 3, 4, 5)

      .messages(customMessages),
  });

  return schema.validate(data, { abortEarly: false });
};

const sanitizeUser = (user) => {
  const sanitizedUser = { ...user.toObject() };
  delete sanitizedUser.password;

  Object.keys(sanitizedUser).forEach((key) => {
    if (
      sanitizedUser[key] === undefined ||
      sanitizedUser[key] === null ||
      sanitizedUser[key] === ""
    ) {
      delete sanitizedUser[key];
    }
  });

  return sanitizedUser;
};

module.exports = {
  validateNewUser,
  validateUser,
  validateUserParams,
  validateUserChangeParams,
  sanitizeUser,
};
