const Joi = require("joi");

const validateContact = (data) => {
  const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;

  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    phone: Joi.string().pattern(phonePattern),
  });
  return schema.validate(data);
};

module.exports = {
  validateContact,
};
