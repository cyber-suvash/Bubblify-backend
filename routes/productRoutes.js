const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  openForm,
  openEdit,
} = require("../controllers/product-controller");


router.put("/:id", editProduct); // PUT  /api/products/:id
router.get("/", getProducts);   // GET   /api/products
router.get("/create", openForm); // GET  /api/products/create
router.post("/create", createProduct); //POST  /api/products/create
router.get("/:id/edit", openEdit);      //GET /api/products/:id/edit
router.delete("/:id", deleteProduct);   // DELETE 	/api/products/:id

module.exports = router;
