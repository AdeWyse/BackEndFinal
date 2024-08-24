const {DataTypes, Op, fn, col} = require("sequelize")
const GenreModel = require('../model/Genre')
const MusicModel = require('../model/Music')

module.exports = {
    
    list: async function(limit, offset) {
        const total = await GenreModel.count();
    
        const genres = await GenreModel.findAll({
            limit: limit,
            offset: offset
        });
    
        return { genres, total };
    },
    
    save: async function(nome) {
        const genre = await GenreModel.create({
            nome: nome
        })
        
        return genre
    },

    update: async function(id, nome) {
        return await GenreModel.update({nome: nome}, {
            where: { codigo: id }
        })
    },

    delete: async function(id) {
        return await GenreModel.destroy({where: { codigo: id }})
    },

    getById: async function(id) {
        return await GenreModel.findByPk(id)
    },

    getByName: async function(nome) {
        return await GenreModel.findOne({where: {nome: {
            [Op.like]: '%' + nome + '%'
        } }})
    },

    listQuantityMusicByGenre: async function(limit, offset) {
        const genres = await GenreModel.findAll({
            limit: limit,
            offset: offset
        });

        const genreList = [];

        for (const genre of genres) {
            const musicCount = await MusicModel.count({
                where: { genre: genre.codigo }
            });

            genreList.push({
                genre: genre.nome,
                musicQuantity: musicCount
            });
        }
        const total = genreList.length

        return { genres: genreList, total };
            
    },
}