const express= require('express')
const router = new express.Router()
const auth = require('../../middlewares/auth')

const Comment = require('../../models/comment')
const Post = require('../../models/post')

router.use(auth)

router.get('/posts', async(req,res) => {

    try {

        const posts = await Post.findAll({
            include: [
                {model : Comment, as: 'comments'}
            ]
        })

        res.render('admin/views/comment/posts', {posts})

    } catch(e) {
        console.log(e)
    }

})

router.get('/posts/:id', async(req,res) => {

    try {

        const post = await Post.findByPk(req.params.id)

        const comments = await Comment.findAll({
            where: {
                postId: post.id
            }
        })

        res.render('admin/views/comment/comments', {post, comments})

    } catch(e) {
        console.log(e)
    }

})

router.delete('/delete/:id', async(req,res) => {

    try {

        const comment = await Comment.findByPk(req.params.id)

        if(!comment) {
            return res.status(400).send()
        }

        await comment.destroy()

        res.status(200).send()

    } catch(e) {
        console.log(e)
        res.status(400).send()
    }

})

router.post('/update', async(req,res) => {

    try {

        const comment = await Comment.findByPk(req.body.id)

        comment.content = req.body.content

        await comment.save()

        res.status(200).json({comment})

    } catch(e) {
        console.log(e)
        res.status(400).send()
    }

})

module.exports = router