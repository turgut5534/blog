const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const auth = require('../middlewares/auth')
const sanitizeHtml = require('sanitize-html');
const email = require('../utils/email')
const { Op } = require('sequelize');

const User = require('../models/user')
const Post = require('../models/post');
const PostContent = require('../models/postContent');
const Comment = require('../models/comment');
const Category = require('../models/category');
const variable = require('../middlewares/variables');
const PostCategory = require('../models/postCategory');

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

        const page = req.query.page || 1; // Get the current page number from the query parameters, default to 1
        const limit = 12; // Limit the number of posts per page to 10
        const offset = (page - 1) * limit;
        
        const blogs = await Post.findAll({
            where: {
                is_active : 1
            },
            include: [
                {model: User},
                {model: PostCategory, include: [
                    {model: Category}
                ]}
            ],
            limit,
            offset,
        })

        const count = await Post.count()

        const totalPages = Math.ceil(count / limit); // Calculate the total number of pages based on the count and limit

        res.render('site/views/index', {blogs, totalPages, currentPage: page})
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

        if(!blog) {
            return res.send('Blog not found')
        }

        let nextPost = await Post.findOne({
            where: {
              id: {
                [Op.gt]: blog.id
              }
            }
          });

        if(!nextPost) {
            nextPost = await Post.findOne({
                order: [['createdAt', 'ASC']]
              });
        }

        let previousPost = await Post.findOne({
            where: {
              id: {
                [Op.lt]: blog.id
              }
            }
          });

        if(!previousPost) {
            previousPost = await Post.findOne({
                order: [['createdAt', 'DESC']]
              });
        }


        res.render('site/views/detail', {blog, categories, sanitizeHtml, previousPost, nextPost })

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

router.get('/contact', async(req,res) => {

    try {

        const users = await User.findAll()

        res.render('site/views/contact', {users})

    } catch(e) {
        console.log(e)
    }
   
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

router.post('/contact', async(req,res) => {

    try {
        const message = {
            from: 'turgut@turgutsalgin.site',
            to: 'turgutsalgin5534@gmail.com',
            subject: 'A New Message From Blog',
            text: req.body.message,
            html: `<p><b>From:</b> ${req.body.name}</p>
            <p><b>Name</b>: ${req.body.name}</p>
            <p><b>Email</b>: ${req.body.email}</p>
            <p><b>Message</b>: ${req.body.message}</p>`
        }

        await email.sendMail(message)

        res.status(200).send()

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }

})

module.exports = router