const express=require('express');
const {uploadImage,getImagesByUser} = require('../controllers/image-controller');
const router=express.Router();
const multer=require('multer');
const path=require('path')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() 
    cb(null,uniqueSuffix + '-' +file.originalname );
  }
})

const upload = multer({ storage })

// PUT  /api/images/upload
router.put('/upload',upload.single('profile_img') ,uploadImage);

// GET /api/images/:id
router.get('/:id',getImagesByUser);

module.exports=router