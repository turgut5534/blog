const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const AlbumPhoto = require('./albumPhoto')

const Album = sequelize.define('album', {
    name : {
      type: Sequelize.STRING,
      allowNull: false
    },
    description : {
        type: Sequelize.STRING
    },
    slug : {
        type: Sequelize.STRING,
        allowNull: false
    }
  });


Album.hasMany(AlbumPhoto)
AlbumPhoto.belongsTo(Album)

module.exports = Album