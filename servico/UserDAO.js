const {DataTypes, Op} = require("sequelize")
const UserModel = require('../model/User')
module.exports = {
    list: async function() {
        const users = await UserModel.findAll()
        return users
    },
    
    save: async function(username, senha, tipo) {
        const artist = await UserModel.create({
            username: username,
            senha: senha,
            tipo: tipo
        })
        
        return artist
    },

    update: async function(id, username,senha, tipo) {
        return await UserModel.update({username: username, senha, tipo}, {
            where: { codigo: id }
        })
    },

    delete: async function(id) {
        //Precisa fazer algo para os livros que este autor possui
        return await UserModel.destroy({where: { codigo: id }})
    },

    getById: async function(id) {
        return await UserModel.findByPk(id)
    },

    getByUsername: async function(nome) {
        return await UserModel.findOne({where: {username: {
            [Op.like]: '%' + nome + '%'
        } }})
    },

    getByType: async function(tipo) {
        return await UserModel.find({where: {tipo: {
            [Op.like]: '%' + tipo + '%'
        } }})
    },

    checkLogin: async function(username, senha) {
        const user = await UserModel.findOne({
            where: {
                username: username
            }
        });

        if (user && senha === user.senha) {
            return true; 
        }

        return false; 
    },

    isAdmin: async function(username) {
        const user = await UserModel.findOne({
            where: {
                username: username
            }
        });
        if (user && user.tipo == 1) {
            return true; 
        }

        return false; 
    },
}