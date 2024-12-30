const express = require("express");

const { addComment } = require("../controllers/commentController");
const { upload } = require("../middleware/uploadImage");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth).use(upload).post("/addComment", addComment);

module.exports = router;
