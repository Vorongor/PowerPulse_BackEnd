const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  bodyPart: {
    type: String,
    required: [true, "Body part is required"],
  },
  equipment: {
    type: String,
    required: [true, "Equipment is required"],
  },
  gifUrl: {
    type: String,
    required: [true, "GIF URL is required"],
  },
  name: {
    type: String,
    required: [true, "Exercise name is required"],
    unique: true,
  },
  target: {
    type: String,
    required: [true, "Target is required"],
  },
  burnedCalories: {
    type: Number,
    required: [true, "Burned calories is required"],
  },
  time: {
    type: Number,
    required: [true, "Time is required"],
  },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {
  Exercise,
};