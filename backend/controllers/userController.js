const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = async () => {
  return jwt.sign({ _id }, process.env.SECRET_KEY, { noTimestamp: true });
};

const createAccount = async (req, res) => {
  try {
    const user = await User.createAccount(req.body);
    const token = await generateToken(user._id)
    res.status(200).json({ userId: user._id, email: user.email, token: token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createAccount };
