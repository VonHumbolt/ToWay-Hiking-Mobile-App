const express = require("express");

const { addComment, getCommentsByRouteId, getCommentsThatIncludesImage, getIllustratedCommentsCount, getNumberOfComments } = require("../controllers/commentController");
const { upload } = require("../middleware/uploadImage");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth).use(upload).post("/addComment", addComment);

router.use(requireAuth).get("/getCommentsByRouteId/:routeId", getCommentsByRouteId);

router.use(requireAuth).get("/getIllustratedComments/:routeId", getCommentsThatIncludesImage);

router.use(requireAuth).get("/numberOfComments/:routeId", getNumberOfComments);

router.use(requireAuth).get("/numberOfIllustratedComments/:routeId", getIllustratedCommentsCount);

module.exports = router;
