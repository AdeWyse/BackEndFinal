const {DataTypes, Op} = require("sequelize")
const ArtistModel = require('../model/Artist')
module.exports = {
    list: async function() {
        const artists = await ArtistModel.findAll()
        return artists
    },
    
    save: async function(nome) {
        const artist = await ArtistModel.create({
            nome: nome
        })
        
        return artist
    },

    update: async function(id, nome) {
        return await ArtistModel.update({nome: nome}, {
            where: { codigo: id }
        })
    },

    delete: async function(id) {
        //Precisa fazer algo para os livros que este autor possui
        return await ArtistModel.destroy({where: { codigo: id }})
    },

    getById: async function(id) {
        return await ArtistModel.findByPk(id)
    },

    getByName: async function(nome) {
        console.log(nome)
        return await ArtistModel.findOne({where: {nome: {
            [Op.like]: '%' + nome + '%'
        } }})
    }
}