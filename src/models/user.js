const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')
const Post = require('./post')
const Category = require('./category')
const Album = require('./album')
const Photo = require('./photo')

const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image: {
      type: Sequelize.STRING
    },
    about: {
      type: Sequelize.TEXT
    },
    website: {
      type: Sequelize.STRING
    }
  });

User.hasMany(Post, { as : 'posts', foreignKey: 'authorId', onDelete: 'CASCADE' })
User.hasMany(Album)

Post.belongsTo(User, { foreignKey: 'authorId'})
Album.belongsTo(User)

sequelize.sync()

module.exports = User