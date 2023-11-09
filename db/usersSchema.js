const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "Set a password for the user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  height: {
    type: Number,
    min: [150, "Minimum height is 150 cm"],
  },
  currentWeight: {
    type: Number,
    min: [35, "Minimum current weight is 35 kg"],
  },
  desiredWeight: {
    type: Number,
    min: [35, "Minimum desired weight is 35 kg"],
  },
  birthday: {
    type: Date,
    validate: {
      validator: function (value) {
        const currentDate = new Date();
        const age = currentDate.getFullYear() - value.getFullYear();
        return age >= 18;
      },
      message: "User must be older than 18 years",
    },
  },
  blood: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  levelActivity: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  bmr: {
    type: Number,
  },
  dailyExerciseTime: {
    type: Number,
    default: 110,
  },
  token: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
