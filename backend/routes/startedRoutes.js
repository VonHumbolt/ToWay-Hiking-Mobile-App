const express  = require("express")

const requireAuth = require("../middleware/requireAuth")
const { startTracking, updateTracking, completeTracking, isUserHasActiveTracking } = require("../controllers/startedRoutesController")

const router = express.Router()

router.use(requireAuth).post("/startTracking", startTracking)

router.use(requireAuth).post("/updateTracking", updateTracking)

router.use(requireAuth).post("/completeTracking", completeTracking)

router.use(requireAuth).get("/isUserHasActiveRoute/:userId", isUserHasActiveTracking)

module.exports = router