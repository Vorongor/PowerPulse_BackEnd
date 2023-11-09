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
    required: [true, "Height is required"],
    min: [150, "Minimum height is 150 cm"],
  },
  currentWeight: {
    type: Number,
    required: [true, "Current weight is required"],
    min: [35, "Minimum current weight is 35 kg"],
  },
  desiredWeight: {
    type: Number,
    required: [true, "Desired weight is required"],
    min: [35, "Minimum desired weight is 35 kg"],
  },
  birthday: {
    type: Date,
    required: [true, "Birthday is required"],
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
    required: [true, "Blood type is required"],
    enum: [1, 2, 3, 4],
  },
  sex: {
    type: String,
    required: [true, "Sex is required"],
    enum: ["male", "female"],
  },
  levelActivity: {
    type: Number,
    required: [true, "Level of activity is required"],
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
