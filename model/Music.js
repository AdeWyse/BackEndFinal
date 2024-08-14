const {DataTypes} = require("sequelize")
const sequelize = require("../helpers/bd")
const ArtistModel = require("./Artist")
const GenreModel = require("./Genre")

const MusicModel = sequelize.define('Musics', 
    {
        codigo: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: DataTypes.STRING
    }
)

MusicModel.belongsTo(ArtistModel, {
    foreignKey: 'artist'
})
ArtistModel.hasMany(MusicModel, {foreignKey: 'artist'})

MusicModel.belongsTo(GenreModel, {
    foreignKey: 'genre'
})
GenreModel.hasMany(MusicModel, {foreignKey: 'genre'})

module.exports = MusicModel
