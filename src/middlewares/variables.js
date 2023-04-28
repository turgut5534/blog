const cache = require('memory-cache');
const Category = require('../models/category');

const addVariable = async(req,res,next) => {
    
    try {

        const cachedData = cache.get('myData');

        if(cachedData) {
    
            res.locals.myData = cachedData
            next()
    
        } else {
    
            const categories = await Category.findAll()
    
            res.locals.myData = categories
    
            cache.put('myData', categories, 10000 )
            next()
    
        }
    
    } catch(e) {
        console.log(e)
    }

}

module.exports = addVariable