const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  fullName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedRoutes: {
    type: [],
    default: [],
  },
  profilePicture: {
    type: String,
  },
  createdRoutes: {
    type: mongoose.Schema.Types.Array,
    ref: "Route",
    default: [],
  },
}, {timestamps: true});

userSchema.statics.createAccount = async function (data) {
  if (!validator.isEmail(data.email)) 
    throw Error("Email must be email type!");

  const isUserExist = await this.findOne({ email: data.email });
  if (isUserExist) throw Error("Email is already in use");

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salt);

  const user = await this.create({
    fullName: data.fullName,
    country: data.country,
    city: data.city,
    email: data.email,
    phoneNumber: data.phoneNumber,
    password: hash,
  });

  return user
};

module.exports = mongoose.model("User", userSchema);
