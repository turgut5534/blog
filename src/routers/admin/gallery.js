const express = require('express')
const Album = require('../../models/album')
const router = new express.Router()
const auth = require('../../middlewares/auth')
const slugify = require('slugify')
const AlbumPhoto = require('../../models/albumPhoto')
const Photo = require('../../models/photo')
const croppedImage = require('../../middlewares/compressImages')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

router.use(auth)

const uploadDirectory = path.join(__dirname, '../../../uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/gallery')
    },
    filename: function (req, file, cb) {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      cb(null, uniqueId + ext);
    }
});
  
const upload = multer({ storage: storage });

router.get('/', async(req,res) => {

    try {

        const albums = await Album.findAll({
            include : [
                { model: AlbumPhoto, include: [
                    {model: Photo}
                ]}
            ]
        })

        res.render('admin/views/gallery/gallery', {albums})

    } catch(e) {
        console.log(e)
    }

})

router.delete('/delete/:id' , async(req,res) => {

    try {

        const album = await Album.findByPk(req.params.id)
        
        if(!album) {
            return res.status(400).send()
        }

        const albumPhotos = await AlbumPhoto.findAll({
            where: {
                albumId: album.id
            },
            include : [
                {model: Photo},
                {model: Album}
            ]
        }) 
        
        if(albumPhotos) {
            for(const album of albumPhotos) {

                const thePhoto = album.photo
    
                try {
    
                    const path = uploadDirectory + '/gallery/' + thePhoto.filename
                    await fs.promises.unlink(path)
    
                } catch(e) {
                    console.log(e)
                }
                
                await thePhoto.destroy()
    
                await album.destroy()
    
            }
        }

        await album.destroy()

        res.status(200).send()


    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.delete('/photo/delete/:id' , async(req,res) => {

    try {

        const photo = await Photo.findByPk(req.params.id)
        
        if(!photo) {
            return res.status(400).send()
        }

        try {

            const path = uploadDirectory + '/gallery/' + photo.filename
            await fs.promises.unlink(path)

        } catch(e) {
            console.log(e)
        }

        const albumPhoto = await AlbumPhoto.findOne({
            where: {
                photoId: photo.id
            }
        })

        await albumPhoto.destroy()

        await photo.destroy()

        res.status(200).send()


    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }

})

router.get('/:slug/add', async(req,res) => {

    try {

        const album = await Album.findOne({
            where: {
                slug: req.params.slug
            }
        })
        res.render('admin/views/gallery/add-photo', {album})        

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

router.post('/photo/save', upload.array('image'), croppedImage, async(req,res) => {

    try {

        const { id } = req.body

        const album = await Album.findOne({
            where: {
                id: id
            }
        })

        if (!album) {
            return res.status(404).send('Album not found')
        }

        const photos = req.files.map(file => {
            return new Photo({
                filename: file.filename,
            })
        })

        for(const photo of photos) {
            
            const newPhoto = await photo.save()

            console.log(newPhoto.id)

            const albumPhoto = new AlbumPhoto({
                albumId: album.id,
                photoId: newPhoto.id
            })

            await albumPhoto.save()
        }

        res.redirect('/admin/gallery')

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.get('/:slug', async(req,res) => {

    try {

        const album = await Album.findOne({
            where: {
                slug: req.params.slug
            }
        })

        const albumPhotos = await AlbumPhoto.findAll({
            where: {
                albumId: album.id
            },
            include : [
                {model: Photo}
            ]
        }) 

        res.render('admin/views/gallery/photos', {album, albumPhotos})

    } catch(e) {
        console.log(e)
    }

})

module.exports = router