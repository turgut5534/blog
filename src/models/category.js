const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const PostCategory = require('./postCategory')

const Category = sequelize.define('category', {
    image : {
      type: Sequelize.STRING
    },
    name : {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug : {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

Category.hasMany(PostCategory)
PostCategory.belongsTo(Category, { foreignKey: 'categoryId'})

module.exports = Category