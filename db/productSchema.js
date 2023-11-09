const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  weight: { Number },
  calories: { Number },
  category: { String },
  title: { String },
  groupBloodNotAllowed: { Object },
});

const Product = mongoose.model("Product", productSchema);

module.exports = {
  Product,
};
