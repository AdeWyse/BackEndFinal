const {DataTypes, Op} = require("sequelize")
const GenreModel = require('../model/Genre')
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
        //Precisa fazer algo para os livros que este autor possui
        return await GenreModel.destroy({where: { codigo: id }})
    },

    getById: async function(id) {
        return await GenreModel.findByPk(id)
    },

    getByName: async function(nome) {
        return await GenreModel.findOne({where: {nome: {
            [Op.like]: '%' + nome + '%'
        } }})
    }
}