const express  = require("express")

const {getallCountries, getCitiesByCountry} = require("../controllers/countryController")

const router = express.Router()

router.get("/getall/", getallCountries)

router.get("/getCitiesByCountry/:countryName", getCitiesByCountry)

module.exports = router