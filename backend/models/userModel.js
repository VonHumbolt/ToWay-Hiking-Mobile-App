const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    savedRoutes: {
        type: [],
        default: []
    },
    profilePicture: {
        type: String
    }
})

module.exports = mongoose.model("User", userSchema)