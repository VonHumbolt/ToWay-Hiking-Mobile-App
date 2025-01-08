const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

const PORT = process.env.PORT || 5000

const userRoutes = require("./routes/user")
const routeRoutes = require("./routes/route")
const startedRoutes = require("./routes/startedRoutes")
const comment = require("./routes/comment")
const country = require("./routes/country")

app.use(express.json())
app.use(cors())

app.use("/api/user/", userRoutes)
app.use("/api/route/", routeRoutes)
app.use("/api/startedRoutes/", startedRoutes)
app.use("/api/comment/", comment)
app.use("/api/country/", country)

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("🚀 App is running on " + PORT)
        })
    })
    .catch((error) => {
        console.log("Error while app is starting => ", error)
    })
