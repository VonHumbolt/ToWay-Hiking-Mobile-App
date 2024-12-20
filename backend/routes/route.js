const express  = require("express")

const {createRoute, getFiveRoutesWithCityName} = require("../controllers/routeController")
const { upload } = require("../middleware/uploadImage")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.get("/getFiveRoutesWithCityName/:cityName", getFiveRoutesWithCityName)

router.use(requireAuth).use(upload).post("/create", createRoute)

module.exports = router