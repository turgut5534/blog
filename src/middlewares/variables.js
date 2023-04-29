const cache = require('memory-cache');
const Category = require('../models/category');
const Post = require('../models/post')
const User = require('../models/user')

const addVariable = async(req,res,next) => {
    
    try {

        const cachedData = cache.get('myData');
        const cachedPosts = cache.get('posts')

        if(cachedData) {
            res.locals.myData = cachedData
        } else {
    
            const categories = await Category.findAll()
    
            res.locals.myData = categories
    
            cache.put('myData', categories, 10000 )
    
        }
        
        if(cachedPosts) {
            res.locals.cachedPosts = cachedPosts
        } else {

            const blogs = await Post.findAll({
                include : [
                    {model: User}
                ]
            })

            res.locals.cachedPosts = blogs

            cache.put('posts', blogs, 10000 )

        }

        next()
       
    
    } catch(e) {
        console.log(e)
    }

}

module.exports = addVariable