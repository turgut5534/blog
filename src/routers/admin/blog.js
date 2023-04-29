const express= require('express')
const router = new express.Router()
const auth = require('../../middlewares/auth')
const Category = require('../../models/category')
const multer = require('multer')
const path = require('path')
const slugify = require('slugify')
const { v4: uuidv4 } = require('uuid')
const compressedImage = require('../../middlewares/compressImages')
const fs = require('fs')

const Post = require('../../models/post')
const PostContent = require('../../models/postContent')

const uploadDirectory = path.join(__dirname, '../../../uploads')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/blogs/')
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
        
        const blogs = await Post.findAll()
        res.render('admin/views/blog/blogs', {blogs})

    } catch(e) {
        console.log(e)
    }
    

})

router.get('/add', auth, async(req,res) => {

    try {

        const categories = await Category.findAll()

        res.render('admin/views/blog/add-blog', {categories})

    } catch(e) {
        console.log(e)
    }   

})

router.get('/edit/:id', auth, async(req,res) => {

    try {

        const categories = await Category.findAll()
        const blog = await Post.findByPk(req.params.id, {
            include: [
                { model: PostContent, as: 'contents' }
            ]
        });
        

        res.render('admin/views/blog/edit-blog', {categories, blog})

    } catch(e) {
        console.log(e)
    }   

})

router.post('/save', auth, upload.single('image'), compressedImage,  async(req,res) => {

    try {

        const { title } = req.body

        const post = new Post({
            title: title,
            slug: slugify(title, {
                lower: true,
                strict: true,
            }),
            image: req.file.filename,
            is_active : 0,
            authorId: req.user.id
        })

        await post.save()

        res.redirect('/admin/blog')


    } catch(e) {
        console.log(e)
    }

})

router.post('/update', auth, upload.single('image'), compressedImage, async(req,res) => {

    try {

        const { id,content, contentId } = req.body

        const post = await Post.findByPk(id)

        const postContent = new PostContent({
            postId: post.id,
            image: req.file.filename,
            content:content
        })

        await postContent.save()

        res.redirect('/admin/blog')


    } catch(e) {
        console.log(e)
    }

})

router.delete('/delete/:id', async(req,res) => {
    
    try {

        const blog = await Post.findByPk(req.params.id)

        if(!blog) {
            return res.status(400).json({error: 'Post not found!'})
        }

        try {
            const path = uploadDirectory + '/blogs/' + blog.image
            await fs.promises.unlink(path)
        } catch(e) {
            console.log(e)
        }

        const contents = await PostContent.findAll({
            where: {
                postId: blog.id
            }
        })

        if(contents) {

            for(const content of contents) {
                if(content.image) {
                    try {
                        const path = uploadDirectory + '/blogs/' + content.image
                        await fs.promises.unlink(path)
                    } catch(e) {
                        console.log(e)
                    }
                }

                await content.destroy()
            }
            
        }

        await blog.destroy()
        
        res.status(200).send()
 

    } catch(e) {
        console.log(e)
    }

})

router.post('/status', async(req,res) => {

    try {

        const blog = await Post.findByPk(req.body.id)
        let text;

        if(blog.is_active == 0) {

            blog.is_active = 1
            text= 'Make Passive'

        } else {

            blog.is_active = 0
            text = 'Make Active'
            
        }

        await blog.save()

        res.status(200).json({text})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

module.exports = router