const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const Comment = sequelize.define('comment', {
    email: {
      type: Sequelize.STRING
    },
    commenter: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    }
});

module.exports = Comment