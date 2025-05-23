const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  product_name: {
    type: String,
    require: true,
    maxlength: 50,
  },
  category: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = model("product", ProductSchema);

module.exports = ProductModel;
