const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const PostCategory = sequelize.define('post_category', {});

module.exports = PostCategory