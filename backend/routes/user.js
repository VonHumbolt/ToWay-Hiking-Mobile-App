const express  = require("express")

const {createAccount, getUserById, saveRouteForUser, removeRouteFromUserSavedRoutes, isRouteInUserSavedRoutes, login} = require("../controllers/userController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.post("/login", login)

router.post("/register", createAccount)

router.get("/getById/:userId", getUserById)

router.use(requireAuth).post("/saveRoute/:routeId/:userId", saveRouteForUser)

router.use(requireAuth).post("/removeRouteFromSaved/:routeId/:userId", removeRouteFromUserSavedRoutes)

router.use(requireAuth).post("/isRouteSaved/:routeId/:userId", isRouteInUserSavedRoutes)

module.exports = router