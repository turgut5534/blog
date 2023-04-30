const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const AlbumPhoto = sequelize.define('album_photo', {});

module.exports = AlbumPhoto