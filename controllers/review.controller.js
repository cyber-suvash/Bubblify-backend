const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const createReview = async (req, res) => {
  const { comment, rating } = req.body;
  const id = req.params.id;
  try {
    const find = await Product.findById(id);
    if (!find) {
      return res.status(404).json({ msg: "Product not found" });
    }
    const newReview = new Review({ comment, rating });
    await newReview.save();
    find.reviews.push(newReview);
    await find.save();
    res.send("new Review saved");
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:"Server error"})
  }
};

module.exports = { createReview };
