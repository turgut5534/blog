const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const auth = require('../middlewares/auth')
const sanitizeHtml = require('sanitize-html');

const User = require('../models/user')
const Post = require('../models/post');
const PostContent = require('../models/postContent');
const Comment = require('../models/comment');
const Category = require('../models/category');
const variable = require('../middlewares/variables')

router.use(variable)

router.get('/sanitize', (req,res) => {
    const htmlText = '<p>This is some <b>HTML</b> text.</p>';
    const sanitizedText = sanitizeHtml(htmlText, {
        allowedTags: [],
        allowedAttributes: {}
      });
      console.log(sanitizedText);
})

router.get('/', async(req,res) => {
    
    try {
        
        const blogs = await Post.findAll({
            where: {
                is_active : 1
            }
        })

        res.render('site/views/index', {blogs})
    } catch(e) {
        console.log(e)
    }

})

router.get('/login', (req,res) => {

    res.render('site/views/login')

})

router.post('/login', async(req,res) => {

    try {
        
        const { email, password } = req.body

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if(!user) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password'
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch) {
            return res.status(400).json({
                status: false,
                message: 'Invalid email or password'
            })
        }

        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '12h'})

        res.cookie('token', token, {httpOnly: true})

        res.status(200).json({
            status: true,
            message: 'Log in successful!'
        })

    } catch(e) {
        console.log(e)
    }

})

router.get('/logout', (req,res) => {

    res.cookie('token', '', { expires: new Date(0) })
  
    res.redirect('/login')
})

router.get('/blogs/:slug', async(req,res) => {
    
    try {

        const blog = await Post.findOne({
            where: {
              slug: req.params.slug
            },
            include: [
              {
                model: User
              },
              {
                model: PostContent,
                as: 'contents'
              },
              {
                model: Comment,
                as: 'comments'
              }
            ]
          });

        const categories = await Category.findAll()

        res.render('site/views/detail', {blog, categories, sanitizeHtml })

    } catch(e) {
        console.log(e)
    }

})

router.get('/category/:slug', async(req,res) => {

    try {

        const category = await Category.findOne({
            where: {
                slug: req.params.slug
            }
        })

        res.render('site/views/about', {category})
    } catch(e) {
        console.log(e)
    }

})

router.get('/about', (req,res) => {

    res.render('site/views/about')

})

router.get('/contact', (req,res) => {

    res.render('site/views/contact')

})

router.post('/comment', async(req,res) => {

    try {

        const comment = new Comment(req.body)
        comment.postId = req.body.postId

        await comment.save()

        const count = await Comment.count()

        res.status(201).json({comment, count})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.post('/user/save', async(req,res) => {

    try {
        
        const user = await User.create(req.body)
        user.password = await bcrypt.hash(req.body.password, 10)
        await user.save()
        res.send(user)

    } catch(e) {
        console.log(e)
    }

})

router.get('/me', auth, (req,res) => {

    res.send(req.user)

})

module.exports = router