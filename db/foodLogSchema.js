const mongoose = require("mongoose");

const foodLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  date: {
    type: String,
    required: [true, "Date is required"],
  },
  amount: {
    type: Number,
    min: 1,
    required: [true, "Amount is required"],
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

const FoodLog = mongoose.model("FoodLog", foodLogSchema);

module.exports = {
  FoodLog,
};
