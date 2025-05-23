const express=require('express');
const handleImage = require('../controllers/image-controller');
const router=express.Router();


router.post('/image-upload',handleImage)

module.exports=router