const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  commentFrom: {
    type: String,
    required: true,
  },
  commentFor: {
    type: String,
    required: true,
  },
  commentMessage: {
    type: String,
    required: true,
  },
  images: {
    type: [],
  }
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema)