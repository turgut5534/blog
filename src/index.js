const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname, '../public')
const viewsDirectory = path.join(__dirname, '../templates')
const uploadDirectory = path.join(__dirname, '../uploads')

const blogRouter = require('./routers/blogRouter')
const adminRouter = require('./routers/adminRouter')

const app = express()

app.set('view engine', 'ejs')
app.set('views', viewsDirectory)

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(publicDirectory))
app.use(express.static(uploadDirectory))
app.use(blogRouter)
app.use('/admin', adminRouter)

app.get('*', (req,res) => {
    res.render('site/views/404')
})

app.listen(port, () => {
    console.log(`Server is up on ${port}`)
})
