const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')
const Post = require('./post')
const Category = require('./category')

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
    }
  });

User.hasMany(Post, { as : 'posts', foreignKey: 'authorId' })

Post.belongsTo(User, { foreignKey: 'authorId'})

// sequelize.sync()

module.exports = User