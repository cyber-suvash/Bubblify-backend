const { Schema, model} = require("mongoose");

const ProductSchema = new Schema({
  product_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  availability: {
    type: Number,
    default:0
  },
  image: {
    url: { type: String ,required:true},
    filename: { type: String ,required:true},
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = model("product", ProductSchema);

module.exports = ProductModel;
