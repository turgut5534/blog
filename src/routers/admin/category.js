const express= require('express')
const router = new express.Router()
const auth = require('../../middlewares/auth')

router.get('/', auth, (req,res) => {

    res.render('admin/views/category/categories')

})

module.exports = router