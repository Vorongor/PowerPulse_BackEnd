const Joi = require("joi");

const validateFood = (data) => {
  const schema = Joi.object({
    amount: Joi.number().min(1).required(),
    calories: Joi.number().min(1).required(),
    // date: Joi.string().isoDate(),
  });
  return schema.validate(data);
};

const validateExercise = (data) => {
  const schema = Joi.object({
    time: Joi.number().min(1).required(),
    calories: Joi.number().min(1).required(),
    // date: Joi.string().isoDate(),
  });
  return schema.validate(data);
};
module.exports = {
  validateFood,
  validateExercise,
};
