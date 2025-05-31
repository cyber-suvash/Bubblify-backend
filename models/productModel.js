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
  availability: {
    type: Number,
    require:true
  },
  image: {
    type: String,
  },
  rating: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = model("product", ProductSchema);

module.exports = ProductModel;
