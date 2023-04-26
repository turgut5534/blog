const express= require('express')
const router = new express.Router()
const categoryRouter = require('./admin/category')

router.get('/', (req,res) => {

    res.send('This is admin')

})

router.use('/category', categoryRouter)

module.exports = router