const express  = require("express")

const {createRoute, getFiveRoutesWithCityName, addImportantPointsToRoute, searchRoutesByName, getRoutesByNumberOfCompletions, getRouteById} = require("../controllers/routeController")
const { upload } = require("../middleware/uploadImage")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.get("/getRouteById/:routeId", getRouteById)

router.get("/getFiveRoutesWithCityName/:cityName", getFiveRoutesWithCityName)

router.get("/searchRoutesByName/:name", searchRoutesByName)

router.get("/getRoutesByNumberOfCompletions", getRoutesByNumberOfCompletions)

router.use(requireAuth).use(upload).post("/create", createRoute)

router.use(requireAuth).post("/addPointToRoute", addImportantPointsToRoute)

module.exports = router