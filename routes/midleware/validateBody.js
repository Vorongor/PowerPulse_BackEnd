const Joi = require("joi");

const customMessages = {
  "number.base": "{#label} повинно бути числом",
  "number.min": "{#label} повинно бути не менше {#limit}",
  "any.required": "{#label} обов'язкове поле",
};

const validateFood = (data) => {
  const schema = Joi.object({
    amount: Joi.number().min(1).required().messages(customMessages),
    calories: Joi.number().min(1).required().messages(customMessages),
  });
  return schema.validate(data, { abortEarly: false });
};

const validateExercise = (data) => {
  const schema = Joi.object({
    time: Joi.number().min(1).required().messages(customMessages),
    calories: Joi.number().min(1).required().messages(customMessages),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  validateFood,
  validateExercise,
};
