const express  = require("express")

const requireAuth = require("../middleware/requireAuth")
const { startTracking, updateTracking } = require("../controllers/startedRoutesController")

const router = express.Router()

router.use(requireAuth).post("/startTracking", startTracking)

router.use(requireAuth).post("/updateTracking", updateTracking)

module.exports = router