const express= require('express')
const User = require('../../models/user')
const router = new express.Router()
const multer = require('multer')
const path = require('path')
const compressedImage = require('../../middlewares/compressImages')
const auth = require('../../middlewares/auth')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const Post = require('../../models/post')

const uploadDirectory = path.join(__dirname, '../../../uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/users/')
    },
    filename: function (req, file, cb) {
      const uniqueId = uuidv4();
      const ext = path.extname(file.originalname);
      cb(null, uniqueId + ext);
    }
});
  
const upload = multer({ storage: storage });

router.get('/', auth, async(req,res) => {

    try {

        const admins = await User.findAll()
        
        res.render('admin/views/admin/admins', {admins})

    } catch(e) {

    }

})

router.get('/add', auth, (req,res) => {
  
    res.render('admin/views/admin/add-admin')

})

router.get('/edit/:id', auth, async(req,res) => {
  
    try {

        const user = await User.findByPk(req.params.id, {
            include : [
                {model : Post, as: 'posts'}
            ]
        })
        res.render('admin/views/admin/edit-admin', {user})

    } catch(e) {
        console.log(e)
    }
    
})


router.post('/save', auth, upload.single('image'), compressedImage, async(req,res) => {

    try {

        const { password } = req.body

        const user = new User(req.body)
        user.password = await bcrypt.hash(password, 10)
        
        if(req.file) {
            user.image = req.file.filename
        }

        await user.save()

        res.redirect('/admin/user')

    } catch(e) {
        console.log(e)
    }

})

router.post('/update', auth, upload.single('image'), compressedImage, async(req,res) => {

    try {

        const { id, name, email, about, password, website } = req.body

        const user = await User.findByPk(id)
        
        if(!user) {
            res.send('No user')
        }

        user.name = name
        user.email = email
        user.about = about
        user.website = website

        if(password) {
            console.log('password changed')
            user.password = await bcrypt.hash(password, 10)
        }
        
        if(req.file) {
            user.image = req.file.filename
        }

        await user.save()

        res.redirect('/admin/user')

    } catch(e) {
        console.log(e)
    }

})

router.delete('/delete/:id', async(req,res) => {

    try {
         
        const user = await User.findByPk(req.params.id)
        
        const userCount = await User.count()

        if(userCount == 1) {
            return res.status(400).send()
        }

        if(!user) {
            return res.status(400).send()
        }

        if(user.is_primary == 1) {
            return res.status(400).send()
        }
        if(user.image) {
            try{
                const path = uploadDirectory + '/users/' + user.image
                await fs.promises.unlink(path)
            } catch(e) {
                console.log(e)
            }
        }

        await user.destroy()

        res.status(200).send()

    } catch(e) {
        console.log(e)
    }

})

module.exports = router