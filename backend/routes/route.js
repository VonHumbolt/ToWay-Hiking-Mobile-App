const express  = require("express")

const {createRoute, getFiveRoutesWithCityName, addImportantPointsToRoute, searchRoutesByCityName, getRoutesByNumberOfCompletions} = require("../controllers/routeController")
const { upload } = require("../middleware/uploadImage")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.get("/getFiveRoutesWithCityName/:cityName", getFiveRoutesWithCityName)

router.get("/searchRoutesByCity/:cityName", searchRoutesByCityName)

router.get("/getRoutesByNumberOfCompletions", getRoutesByNumberOfCompletions)

router.use(requireAuth).use(upload).post("/create", createRoute)

router.use(requireAuth).post("/addPointToRoute", addImportantPointsToRoute)

module.exports = router