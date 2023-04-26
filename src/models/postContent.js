const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const PostContent = sequelize.define('post_content', {
  image: {
    type: Sequelize.STRING
  },
    content : {
        type: Sequelize.TEXT,
        allowNull: false
    }
  });

module.exports = PostContent