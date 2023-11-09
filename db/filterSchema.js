const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema({
  filter: {
    type: String,
    required: [true, "Filter is required"],
  },
  name: {
    type: String,
    required: [true, "Category name is required"],
    unique: true,
  },
  imgURL: {
    type: String,
    required: [true, "Image URL is required"],
  },
});

const Filter = mongoose.model("Filter", filterSchema);

module.exports = {
    Filter,
};
