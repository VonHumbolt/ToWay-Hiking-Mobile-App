const express  = require("express")

const {createAccount, getUserById, saveRouteForUser, removeRouteFromUserSavedRoutes, isRouteInUserSavedRoutes, login, getUserSavedRoutes, searchUserByName} = require("../controllers/userController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

router.post("/login", login)

router.post("/register", createAccount)

router.get("/getById/:userId", getUserById)

router.get("/searchUserByName/:name", searchUserByName)

router.use(requireAuth).post("/saveRoute/:routeId/:userId", saveRouteForUser)

router.use(requireAuth).post("/removeRouteFromSaved/:routeId/:userId", removeRouteFromUserSavedRoutes)

router.use(requireAuth).post("/isRouteSaved/:routeId/:userId", isRouteInUserSavedRoutes)

router.use(requireAuth).get("/getSavedRoutes/:userId", getUserSavedRoutes)

module.exports = router