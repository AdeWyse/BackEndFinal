const {DataTypes, Op} = require("sequelize")
const sequelize = require("../helpers/bd")

const ArtistModel = sequelize.define('Artist', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING
    }
)

module.exports = ArtistModel