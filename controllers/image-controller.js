
const ImageModel = require("../models/ImageModel");
const fs = require("fs");
const UserModel = require("../models/registerModel");

const uploadImage = async (req, res) => {
  const { userId, fullname } = req.body;
  console.log(fullname, userId);

  try {
    // Validate
    if (!userId) {
      return res.status(400).json({ msg: "User id is required" });
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
        return res.status(404).json({ msg: "User not found" }); // Changed to 404
      }
    }

    // Handle image upload
    let savedImage = null;
    if (req.file) {
      // Delete previous image if it exists
      const existing = await ImageModel.findOne({ userId });

      if (existing) {
        fs.unlink(existing.path, (err) => {
          if (err) console.log("Error deleting previous image:", err);
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
      image: savedImage,
    });
  } catch (error) {
    console.error("Update error:", error); // Add error logging
    res.status(500).json({ msg: "Internal server error, please try again" });
  }
};

const getImagesByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const imagefile = await ImageModel.findOne({ userId });
    if (!imagefile) {
      return res.status(404).json({ msg: "No image found" });
    }
    res.json({ status: "ok", data: imagefile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {uploadImage, getImagesByUser};
