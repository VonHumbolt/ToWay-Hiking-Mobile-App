const mongoose = require("mongoose")

const Schema = mongoose.Schema

const routeSchema = new Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId
    },
    ownerId: {
        type: String,
        reqired: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number
    },
    distance: {
        type: Number,
        reuired: true
    },
    level: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    categories: {
        type: [],
    },
    coordinates: {
        type: [],
        required: true
    },
    images: {
        type: [],
    },
    comments: {
        type: mongoose.Schema.Types.Array,
        ref: "Comment",
        default: []
    },
    isPublic: {
        type: Boolean,
    },
    importantPoints: {
        type: Object,
    }
}, {timestamps: true})

module.exports = mongoose.model("Route", routeSchema)