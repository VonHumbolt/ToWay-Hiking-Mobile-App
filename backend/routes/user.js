const express  = require("express")

const {createAccount, getUserById} = require("../controllers/userController")

const router = express.Router()

router.post("/register", createAccount)

router.get("/getById/:userId", getUserById)

module.exports = router