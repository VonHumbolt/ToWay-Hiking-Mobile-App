const express  = require("express")

const {createRoute, getFiveRoutesWithCityName} = require("../controllers/routeController")
const { upload } = require("../middleware/uploadImage")

const router = express.Router()

router.get("/getFiveRoutesWithCityName/:cityName", getFiveRoutesWithCityName)

router.use(upload).post("/create", createRoute)

module.exports = router