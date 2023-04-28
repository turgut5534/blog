const express= require('express')
const router = new express.Router()
const categoryRouter = require('./admin/category')
const blogRouter = require('./admin/blog')

router.get('/', (req,res) => {

    res.send('This is admin')

})

router.use('/category', categoryRouter)
router.use('/blog', blogRouter)

module.exports = router