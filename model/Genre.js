const {DataTypes, Op} = require("sequelize")
const sequelize = require("../helpers/bd")

const GenreModel = sequelize.define('Genre', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING
    }
)

module.exports = GenreModel