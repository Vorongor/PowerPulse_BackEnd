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
    // Додайте інші поля за аналогією
  });

  return schema.validate(data, { abortEarly: false });
};

const validateUserChangeParams = (data) => {
  const schema = Joi.object({
    height: Joi.number().min(150).messages(customMessages),
    currentWeight: Joi.number().min(35).messages(customMessages),
    // Додайте інші поля за аналогією
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateNewUser,
  validateUser,
  validateUserParams,
  validateUserChangeParams,
};
