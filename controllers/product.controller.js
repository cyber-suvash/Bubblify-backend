const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().populate('reviews');
    if (!allProducts || allProducts.length === 0) {
      return res
        .status(404)
        .render("errProduct.ejs", { message: "No products available." });
    }
    res.status(200).json({ products: allProducts });
    // res.render("home.ejs", { allProducts });
  } catch (error) {
    res.status(500).render("error.ejs", { message: "Internal server error" });
  }
};
const getOneProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("reviews");
    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }
    res.status(200).json({product:product});
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      category,
      price,
      description,
      availability,
      image,
      rating,
    } = req.body;
    const n = await Product.create({
      product_name,
      category,
      price,
      description,
      availability,
      image,
      rating,
    });
    // newProduct is already saved—no need for newProduct.save()
    res.status(201).json({ msg: "product save successfully!" });
    //   return res.status(201).redirect("/api/products");
  } catch (err) {
    console.error(err);
    return res.status(500).render("error.ejs", {
      message: "Cannot create product right now, please try later.",
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      category,
      price,
      description,
      availability,
      image,
      rating,
    } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_name,
        category,
        price,
        description,
        availability,
        image,
        rating,
      },
      { runValidators: true, new: true }
    );
    console.log(updatedProduct);
    res.json({ msg: "Changes successful" });
    // res.redirect('/api/products')
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const openForm = (req, res) => {
  // res.render("create.ejs");
};
const openEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    // res.status(200).json({msg:'found product'},product)
    // res.render('edit.ejs',{product})
  } catch (err) {
    res.status(500).render("error.ejs", err);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(400).json({
        success: false,
        message: "Product not found, cannot delete",
      });
    }
    res.status(200).json({ msg: "Successfully deleted" });
    // res.redirect('/api/products')
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getProducts,
  getOneProduct,
  createProduct,
  openForm,
  deleteProduct,
  editProduct,
  openEdit,
};
