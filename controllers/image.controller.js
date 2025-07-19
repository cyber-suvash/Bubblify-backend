const ImageModel = require("../models/ImageModel");
const UserModel = require("../models/registerModel");
const { cloudinary } = require("../cloud/cloudConfig");

const uploadImage = async (req, res) => {
  const { userId, fullname } = req.body;

  try {
    // Validate
    if (!userId) {
      return res.status(400).json({ msg: "User id is required" });
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
      const imgURL = req.file.path;
      const filename = req.file.filename;
      const img = { url: imgURL, filename };
      newImg = new ImageModel({ userId, image: img });
      await newImg.save();
    }
    // check exist user
    const existUser = await UserModel.findById(userId);

    if (!existUser) {
      return res.status(404).json({ msg: "User not found!" });
    }
    // if (existUser.fullname === fullname) {
    //   return res.status(409).json({ msg: "please chnage name or image" });
    // }
    //  update username
    let updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { fullname },
      { runValidators: true, new: true }
    );

    return res.status(200).json({
      msg: "Profile update successfully",
      newImg,
      user: {
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        role: updatedUser.role,
        _id: updatedUser._id,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: "Internal server error, please try again" });
  }
};

const ImageUploadforProducts = async (req, res) => {
  if (req.file) {
    const ImgURL = req.file.path;
    const filename = req.file.filename;
    res.status(200).json({ url: ImgURL, filename });
  }
};

const getImageByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagefile = await ImageModel.findOne({ userId });

    if (!imagefile) {
      return res.status(404).json({ msg: "No image found" });
    }
    res.status(200).json({ imagefile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { uploadImage, ImageUploadforProducts, getImageByUser };
