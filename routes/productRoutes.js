const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  openForm,
  openEdit
} = require("../controllers/product-controller");

router.get("/products/create", openForm);
router.get("/products", getProducts);
router.get("/products/:id/edit",openEdit);
router.post("/products/create", createProduct);
router.put('/products/:id',editProduct);
router.delete("/products/:id", deleteProduct);


module.exports = router;
