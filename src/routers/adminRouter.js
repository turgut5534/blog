const express= require('express')
const router = new express.Router()

const categoryRouter = require('./admin/category')
const blogRouter = require('./admin/blog')
const adminRouter = require('./admin/admin')
const commentRouter = require('./admin/comment')
const galleryRouter = require('./admin/gallery')

router.get('/', (req,res) => {

    res.send('This is admin')

})

router.use('/category', categoryRouter)
router.use('/blog', blogRouter)
router.use('/user', adminRouter)
router.use('/comment', commentRouter)
router.use('/gallery', galleryRouter)

module.exports = router