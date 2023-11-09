const Joi = require("joi");

const validateNewUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateUser = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const validateUserParams = (data) => {
  const schema = Joi.object({
    height: Joi.number().min(150).required(),
    currentWeight: Joi.number().min(35).required(),
    desiredWeight: Joi.number().min(35).required(),
    birthday: Joi.date()
      .max("now")
      .iso()
      .required()
      .custom((value, helpers) => {
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        if (age < 18) {
          return helpers.error("any.invalid");
        }
        return value;
      }, "must be older than 18 years"),
    blood: Joi.number().valid(1, 2, 3, 4).required(),
    sex: Joi.string().valid("male", "female").required(),
    levelActivity: Joi.number().valid(1, 2, 3, 4, 5).required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateNewUser,
  validateUser,
  validateUserParams,
};
