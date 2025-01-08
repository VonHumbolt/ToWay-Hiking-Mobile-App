const mongoose = require("mongoose")

const Schema = mongoose.Schema

const countrySchema = new Schema({
    countryId: {
        type: mongoose.Schema.Types.ObjectId
    },
    name: {
        type: String,
        required: true
    },
    cities: {
        type: [],
        default: []
    },
})

module.exports = mongoose.model("Country", countrySchema)