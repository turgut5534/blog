const express = require('express')
const Album = require('../../models/album')
const router = new express.Router()
const auth = require('../../middlewares/auth')
const slugify = require('slugify')

router.use(auth)

router.get('/', async(req,res) => {

    try {

        const albums = await Album.findAll()

        res.render('admin/views/gallery/gallery', {albums})

    } catch(e) {
        console.log(e)
    }

})

router.post('/album/add', async(req,res) => {

    try {

        const album = new Album(req.body)
        album.slug = slugify(req.body.name, {
            lower: true,
            strict: true
        })
        album.UserId = req.user.UserId

        await album.save()

        res.status(201).send(album)

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

module.exports = router