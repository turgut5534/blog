const Sequelize = require('sequelize')
const sequelize = require('../db/mysql')

const PostContent = require('./postContent')
const Comment = require('./comment');
const PostCategory = require('./postCategory');

const Post = sequelize.define('post', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false
    },
    image : {
        type: Sequelize.STRING
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  // sequelize.getQueryInterface().addColumn('posts', 'is_active', {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: true,
  //   allowNull: false,
  //   after: 'image'
  // });
  

Post.hasMany(PostContent, { as: 'contents', foreignKey: 'postId'})
Post.hasMany(Comment, { as: 'comments', foreignKey: 'postId', onDelete: 'CASCADE'})
Post.hasMany(PostCategory)

PostContent.belongsTo(Post, { foreignKey: 'postId'})  
Comment.belongsTo(Post, { foreignKey: 'postId'} )
PostCategory.belongsTo(Post, { foreignKey: 'postId'})

module.exports = Post