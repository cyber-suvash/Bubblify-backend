const { Schema, model, default: mongoose } = require("mongoose");

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
    require: true,
  },
  image: {
    url: { type: String },
    filename: { type: String },
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ This creates a relationship with the "User" model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProductModel = model("product", ProductSchema);

module.exports = ProductModel;
