const mongoose = require("mongoose")

const Schema = mongoose.Schema

const startedRoutesSchema = new Schema({
    startedRoutesId: {
        type: mongoose.Schema.Types.ObjectId
    },
    userId: {
        type: String,
        required: true
    },
    routeId: {
        type: String,
        required: true
    },
    userCoordinates: {
        type: Object
    },
    isRouteActive: {
        type: Boolean,
    },
    isCompleted: {
        type: Boolean
    },
    duration: {
        type: Number,
    },
    destination: {
        type: Number
    }
})