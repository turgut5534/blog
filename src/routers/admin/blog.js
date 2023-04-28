const express= require('express')
const router = new express.Router()
const auth = require('../../middlewares/auth')
const Category = require('../../models/category')
const multer = require('multer')
const path = require('path')
const slugify = require('slugify')
const { v4: uuidv4 } = require('uuid')

const Post = require('../../models/post')
const PostContent = require('../../models/postContent')

const uploadDirectory = path.join(__dirname, '../../uploads')

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

router.post('/save', auth, upload.single('image'), async(req,res) => {

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

router.post('/update', auth, upload.single('image'), async(req,res) => {

    try {

        const { id,content } = req.body

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

module.exports = router