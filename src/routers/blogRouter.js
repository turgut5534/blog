const express = require('express')
const router = new express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();
const auth = require('../middlewares/auth')

const User = require('../models/user')

router.get('/', async(req,res) => {
    
    try {
        res.render('site/views/index')
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

        res.render('site/views/detail')

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