const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const AlbumPhoto = require('./albumPhoto')

const Photo = sequelize.define('photo', {

    filename : {
      type: Sequelize.STRING,
      allowNull: false
    },
    thumbnail : {
        type: Sequelize.STRING
    }
  });

Photo.hasMany(AlbumPhoto)
AlbumPhoto.belongsTo(Photo)

module.exports = Photo