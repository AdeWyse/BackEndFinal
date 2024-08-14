const MusicModel = require('../model/Music')
const ArtistModel = require('../model/Artist')
const ArtistDAO = require('./ArtistDAO')
const GenreModel = require('../model/Genre')
const GenreDAO = require('./GenreDAO') 

module.exports = {
    list: async function() {
        const musics = await MusicModel.findAll({ include: ArtistModel })
        return musics
    },
    
    save: async function(nome, artist, genre) {
        if (artist instanceof ArtistModel) {
            artist = artist.codigo
        } else if (typeof artist === 'string') {
            obj = await ArtistDAO.getByName(artist) 
            console.log(obj)
            if (!obj) {
                return null
            }
            artist = obj.codigo
        }

        if (genre instanceof GenreModel) {
            genre = genre.codigo
        } else if (typeof genre === 'string') {
            obj = await GenreDAO.getByName(genre) 
            console.log(obj)
            if (!obj) {
                return null
            }
            genre = obj.codigo
        }

        const music = await MusicModel.create({
            nome: nome,
            artist: artist,
            genre: genre
        })
        return music
    },

    update: async function(id, obj) {
        
        let music = await MusicModel.findByPk(id)
        if (!music) {
            return false
        }
        
        Object.keys(obj).forEach(key => music[key] = obj[key])
        await music.save()
        return music
    },

    delete: async function(id) {
        const music = await MusicModel.findByPk(id)
        return music.destroy()
    },

    getById: async function(id) {
        return await MusicModel.findByPk(id)
    }
}