const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
});

// define the model or the collection name
const UserModel = model("User", UserSchema);

module.exports = UserModel;
