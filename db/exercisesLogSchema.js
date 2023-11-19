const mongoose = require("mongoose");

const exerciseLogSchema = new mongoose.Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: [true, "Exercise ID is required"],
  },
  bodyPart: {
    type: String,
    required: [true, "Body part is required"],
  },
  equipment: {
    type: String,
    required: [true, "Equipment is required"],
  },
  name: {
    type: String,
    required: [true, "Exercise name is required"],
  },
  target: {
    type: String,
    required: [true, "Exercise target is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  time: {
    type: Number,
    min: 1,
    required: [true, "Time is required"],
  },
  calories: {
    type: Number,
    min: 1,
    required: [true, "Calories are required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const ExerciseLog = mongoose.model("ExerciseLog", exerciseLogSchema);

module.exports = {
  ExerciseLog,
};
