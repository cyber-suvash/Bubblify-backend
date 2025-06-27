const express = require("express");
const router = express.Router();
const {
  getProducts,
  getOneProduct,
  createProduct,
  editProduct,
  deleteProduct,
  openForm,
  openEdit,
} = require("../controllers/product.controller");
const { createReview } = require('../controllers/review.controller');
const { verifyAuthentication } = require("../middlewares/auth-verify");

// Static routes first
router.get("/create", openForm);              // GET  /api/products/create
router.post("/create", verifyAuthentication, createProduct); // POST /api/products/create
router.get("/:id/edit", openEdit);            // GET /api/products/:id/edit

// Dynamic routes after
router.put("/:id", editProduct);              // PUT  /api/products/:id
router.get("/", getProducts);                 // GET  /api/products
router.get("/:id", getOneProduct);            // GET /api/products/:id
router.delete("/:id", deleteProduct);         // DELETE /api/products/:id
router.post("/:id/review", createReview);     // POST /api/products/:id/review

module.exports = router;
