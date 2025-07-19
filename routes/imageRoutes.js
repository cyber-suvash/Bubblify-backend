const express = require("express");
const {
  uploadImage,
  getImageByUser,
  ImageUploadforProducts,
} = require("../controllers/image.controller");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { storage,storage2 } = require("../cloud/cloudConfig");

const upload = multer({ storage });
const productupload=multer({storage:storage2})

// PUT  /api/images/upload
router.put("/upload", upload.single("profile_img"), uploadImage);
router.post("/products/upload",productupload.single('product_image'),ImageUploadforProducts);

// GET /api/images/:id
router.get("/:id", getImageByUser);

module.exports = router;
