const express  = require("express")

const {createRoute} = require("../controllers/routeController")
const { upload } = require("../middleware/uploadImage")

const router = express.Router()

router.use(upload).post("/create", createRoute)

module.exports = router