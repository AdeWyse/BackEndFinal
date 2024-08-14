const {DataTypes, Op} = require("sequelize")
const sequelize = require("../helpers/bd")

const UserModel = sequelize.define('Users', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: DataTypes.STRING,
        senha: DataTypes.STRING,
        tipo: DataTypes.INTEGER
    }
)

module.exports = UserModel