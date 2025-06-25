const ImageModel = require("../models/ImageModel");
const fs = require("fs");
const UserModel = require("../models/registerModel");
const { cloudinary } = require("../cloud/cloudConfig");

const uploadImage = async (req, res) => {
  const { userId, fullname } = req.body;

  try {
    // Validate
    if (!userId) {
      return res.status(400).json({ msg: "User id is required" });
    }
    // check exist user
    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      return res.status(404).json({ msg: "User not found!" });
    }

    let updatedUser = existUser;
    //  update username
    if (existUser.fullname !== fullname) {
      updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { fullname },
        { runValidators: true, new: true }
      );
    }

    let newImg = null;
    if (req.file) {
      // check existing image
      const existing = await ImageModel.findOne({ userId });

      if (existing) {
        // Delete the old image from Cloudinary using its public_id
        const publicId = existing.image.filename;
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Cloudinary delete error", error);
        }
        // Delete old image document from MongoDB
        await ImageModel.deleteOne({ userId });
      }

      // Save new image
      const { path, filename } = req.file;
      const img = { url: path, filename };
      newImg = new ImageModel({ userId, image: img });
      await newImg.save();
    }
    return res
      .status(200)
      .json({ msg: "Profile update successfully", newImg, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error); // Add error logging
    res.status(500).json({ msg: "Internal server error, please try again" });
  }
};

const ImageUploadforProducts=async(req,res)=>{


}

const getImageByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagefile = await ImageModel.findOne({ userId });

    if (!imagefile) {
      return res.status(404).json({ msg: "No image found" });
    }
    res.json({ data: imagefile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { uploadImage,ImageUploadforProducts, getImageByUser };
