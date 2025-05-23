const express = require("express");
const path=require('path')
const productRoutes = require("./routes/productRoutes");
const authRoutes=require("./routes/authRoutes")
const imageRoute=require('./routes/imageRoute')
const ConnectDB = require("./config/db");
const methodOverride=require('method-override')
const app = express();
const port = process.env.PORT;
const cors=require('cors');
const multer  = require('multer')
const ImageModel=require('./models/profileModel')
const fs=require('fs')
const UserModel= require('./models/registerModel');


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

//connect mongodb
ConnectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
const CorsOptions = {
  origin: ['http://localhost:5173', 'https://bublify-e-commerce.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // <--- Add this
};
app.use(cors(CorsOptions));


app.set('view engine',"ejs")
app.set("views",path.join(__dirname,"views"))
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
// CSS
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
// JS (includes Popper)
app.use('/js',  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));


app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce server");
});

app.put('/user/image-upload', upload.single('profile_img'), async (req, res) => {
  const { userId, fullname } = req.body;
  console.log(fullname, userId);
  
  try {
    // Validate 
    if (!userId) {
      return res.status(400).json({ msg: 'User id is required' });
    }

    // Update username 
    let updatedUser = null;
    if (fullname) {
      // Fix: Use userId directly, not as an object
      updatedUser = await UserModel.findByIdAndUpdate(
        userId, // Pass userId directly, not {userId}
        { fullname }, 
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found' }); // Changed to 404
      }
    }

    // Handle image upload
    let savedImage = null;
    if (req.file) {
      // Delete previous image if it exists
      const existing = await ImageModel.findOne({ userId });
      
      if (existing) {
        fs.unlink(existing.path, (err) => {
          if (err) console.log('Error deleting previous image:', err);
        });
        await ImageModel.deleteOne({ userId });
      }
      
      // Save new image
      const { path, filename } = req.file;
      const newImage = new ImageModel({ userId, path, filename });
      savedImage = await newImage.save();
    }

    // Send response with updated data
    res.json({
      msg: "Profile updated successfully",
      user: updatedUser,
      image: savedImage
    });
    
  } catch (error) {
    console.error('Update error:', error); // Add error logging
    res.status(500).json({ msg: "Internal server error, please try again" });
  }
});


app.get('/getimage/:id',async(req,res)=>{
  try {
    const userId=req.params.id;
    const imagefile=await ImageModel.findOne({userId});
    if(!imagefile){
      return res.status(404).json({msg:'No image found'})
    }
    res.json({status:"ok",data:imagefile})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error" });
  }

});

// app.put('/api/user/:id',async(req,res)=>{
  
//   const userId =req.params.id;
//   const data =req.body;
//   console.log(userId)
//   console.log(data)

//   const avilableUser= await UserModel.findById(userId)

//   if(!avilableUser){
//     res.json({msg:"not found"})
//   }
//     console.log(avilableUser);
//     res.json({msg:"found user"})
// })
  
// mount router
app.use('/api',productRoutes)
app.use('/api/user',authRoutes)


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
