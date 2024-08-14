const express = require("express")
const path = require("path")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const cookieParser = require("cookie-parser")
app.use(cookieParser())

//Sessão
const session = require("express-session")

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use("/music", require("./control/MusicAPI"))
app.use("/artist", require("./control/ArtistAPI"))
app.use("/genre", require("./control/GenreAPI"))
app.use("/user", require("./control/UserAPI"))
app.use("/login", require('./control/LoginAPI'))
app.use("/install", require('./control/InstallAPI'))

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_doc.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))



app.listen(3000, () => {
    console.log("Listenning...")
})