const express  = require("express")

const {createAccount, getUserById, saveRouteForUser, removeRouteFromUserSavedRoutes, isRouteInUserSavedRoutes, login, getUserSavedRoutes, searchUserByName, getUserCompletedRoutes, getUserCreatedRoutes, updateProfileImage} = require("../controllers/userController")
const requireAuth = require("../middleware/requireAuth")
const { upload } = require("../middleware/uploadImage")

const router = express.Router()

router.post("/login", login)

router.post("/register", createAccount)

router.get("/getById/:userId", getUserById)

router.get("/searchUserByName/:name", searchUserByName)

router.use(requireAuth).post("/saveRoute/:routeId/:userId", saveRouteForUser)

router.use(requireAuth).post("/removeRouteFromSaved/:routeId/:userId", removeRouteFromUserSavedRoutes)

router.use(requireAuth).post("/isRouteSaved/:routeId/:userId", isRouteInUserSavedRoutes)

router.use(requireAuth).get("/getSavedRoutes/:userId", getUserSavedRoutes)

router.use(requireAuth).get("/getCompletedRoutes/:userId", getUserCompletedRoutes)

router.use(requireAuth).get("/getCreatedRoutes/:ownerId/:profileId", getUserCreatedRoutes)

router.use(requireAuth).use(upload).post("/updateProfileImage", updateProfileImage)

module.exports = router