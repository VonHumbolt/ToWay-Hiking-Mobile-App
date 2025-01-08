const Country = require("../models/countryModal")

const getallCountries = async (req, res) => {
    try {
        const countries = await Country.find({}).sort({ name: "ascending" })
        res.status(200).json(countries)
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

const getCitiesByCountry = async (req, res) => {
    const {countryName} = req.params
    try {
        const country = await Country.findOne({name: countryName})
        res.status(200).json({cities: country.cities})
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getallCountries,
    getCitiesByCountry
};
  