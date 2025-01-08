const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Route = require("../models/routeModel");

const addComment = async (req, res) => {
  const { userId, routeId, commentMessage } = req.body;
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
    console.log("Created -> ", comment);

    await Route.findByIdAndUpdate(
      { _id: routeId },
      { $push: { comments: comment } }
    );

    res.status(200).json({
      comment: comment,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getCommentsByRouteId = async (req, res) => {
  const { routeId } = req.params;
  try {
    const comments = await Comment.find({ commentFor: routeId }).sort({
      createdAt: "descending",
    });
    const commentList = [];
    for (let i = 0; i < comments.length; i++) {
      const element = comments[i];
      const commentOwnerId = element.commentFrom;
      const user = await User.findById({ _id: commentOwnerId });
      const comment = {
        commentId: element._id,
        owner: user.fullName,
        profilePicture: user.profilePicture,
        commentMessage: element.commentMessage,
        images: element.images,
        createdAt: element.createdAt,
      };
      commentList.push(comment);
    }
    res.status(200).json({ comments: commentList });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getCommentsThatIncludesImage = async (req, res) => {
  const { routeId } = req.params;
  try {
    const comments = await Comment.find({ commentFor: routeId }).sort({
      createdAt: "descending",
    });
    const commentList = [];
    for (let i = 0; i < comments.length; i++) {
      const element = comments[i];
      // If comment has any images, we will add it into commentList
      if (element.images.length > 0) {
        const commentOwnerId = element.commentFrom;
        const user = await User.findById({ _id: commentOwnerId });
        const comment = {
          commentId: element._id,
          owner: user.fullName,
          profilePicture: user.profilePicture,
          commentMessage: element.commentMessage,
          images: element.images,
          createdAt: element.createdAt,
        };
        commentList.push(comment);
      }
    }
   
    res.status(200).json({ comments: commentList });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getNumberOfComments = async (req, res) => {
  const {routeId} = req.params
  try {
    const numberOfComments = await Comment.countDocuments({ commentFor: routeId })
    res.status(200).json({numberOfComments: numberOfComments})
  } catch (error) {
    console.log(error)
    res.status(400).json({error: error.message})
  }
}

const getIllustratedCommentsCount = async(req, res) => {
  const { routeId } = req.params;
  try {
    const comments = await Comment.find({ commentFor: routeId }).sort({
      createdAt: "descending",
    });
    let count = 0
    for (let i = 0; i < comments.length; i++) {
      const element = comments[i];
      if (element.images.length > 0) {
        count += 1
      }
    }

    res.status(200).json({ numberOfComments: count });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = { addComment, getCommentsByRouteId, getCommentsThatIncludesImage, getNumberOfComments, getIllustratedCommentsCount };
