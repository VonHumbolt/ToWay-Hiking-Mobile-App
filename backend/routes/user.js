const express  = require("express")

const {createAccount} = require("../controllers/userController")

const router = express.Router()

router.post("/register", createAccount)

module.exports = router