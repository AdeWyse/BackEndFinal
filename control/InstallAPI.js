const express = require("express")
const router = express.Router()
const sequelize = require("../helpers/bd")

const ArtistDAO = require('../servico/ArtistDAO')
const GenreDAO = require('../servico/GenreDAO') 
const MusicDAO = require('../servico/MusicDAO')
const UserDAO = require('../servico/UserDAO')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    let artistas = [
        "Taylor Swift", "Ruelle", "Xuxa", "Pitty", "Katy Perry"
    ]
    let martistas = []
    for (let i = 0; i < artistas.length; i++) {
        martistas.push(await ArtistDAO.save(artistas[i]))
    }

    let generos = [
        "Pop", "MPB", "Infantil", "Rock", "Jazz"
    ]
    let mgeneros = []
    for (let i = 0; i < generos.length; i++) {
        mgeneros.push(await GenreDAO.save(generos[i]))
    }

    let music1 = await MusicDAO.save("Back to December", martistas[0].codigo, mgeneros[0].codigo)
    let music2 = await MusicDAO.save("Lua de Cristal", martistas[2], mgeneros[2])
    let music3 = await MusicDAO.save("Admirável Mundo Novo", martistas[3], mgeneros[3])
    let music4 = await MusicDAO.save("Last Friday Night", martistas[4], mgeneros[0])
    let music5 = await MusicDAO.save("The Other Side", martistas[1], mgeneros[0])

    lmusicas = [music1, music2, music3, music4, music5]

    let user1 = await UserDAO.save("ladyAdmin", "admin123",1)
    let user2 = await UserDAO.save("basicUser", "user123",0)
    let user3 = await UserDAO.save("carlinhos", "naoLembro123", 0)
    let user4 = await UserDAO.save("batataCuriosa", "senha123", 0)
    let user5 = await UserDAO.save("adeline", "senha123", 1)

    lusers = [user1, user2, user3, user4, user5]
    res.json({status:true, artistas: martistas, generos: mgeneros, musicas: lmusicas, usuarios: lusers})
})

module.exports = router