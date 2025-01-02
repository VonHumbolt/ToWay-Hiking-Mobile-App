const Comment = require("../models/commentModel");
const Route = require("../models/routeModel");

const addComment = async (req, res) => {
  const { userId, routeId, commentMessage  } = req.body;
  const commentImages = [];
  for (let i = 0; i < req.files.length; i++) {
    const image = req.files[i];
    commentImages.push(image.path);
  }
  try {
    const comment = await Comment.create({
      commentFrom: userId,
      commentFor: routeId,
      commentMessage: commentMessage,
      images: commentImages,
    });
    console.log("Created -> ", comment)
    
    await Route.findByIdAndUpdate({_id: routeId}, { $push: { comments: comment } })

    res.status(200).json({
      comment: comment
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
 
module.exports = { addComment };
