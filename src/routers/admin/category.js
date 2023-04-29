const express= require('express')
const router = new express.Router()
const auth = require('../../middlewares/auth')
const Category = require('../../models/category')
const slugiyf = require('slugify')

router.get('/', auth, async(req,res) => {

    try{

        const categories = await Category.findAll()

        res.render('admin/views/category/categories', {categories})

    } catch(e) {
        console.log(e)
    }

})

router.post('/save', async(req,res) => {

    try{
        
        const category = new Category(req.body)
        category.slug = slugiyf(req.body.name, {
            lower: true,
            strict: true
        })

        const newCtegory = await category.save()

        res.status(201).json({category: newCtegory})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.delete('/delete/:id', async(req,res) => {

    try{
        
        const category = await Category.findByPk(req.params.id)
        
        await category.destroy()

        res.status(200).send()

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

module.exports = router