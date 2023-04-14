const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')

// View Engine
app.set('view engine', 'ejs')

// Static Files
app.use(express.static('public'))

// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso")
    })
    .catch(error => {
        console.log(error)
    })

// Rotas
app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', async (req, res) => {
    const articles = await Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    res.render('index', { articles: articles })
})

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug

    try {
        var article = await Article.findOne({
            where: {
                slug: slug
            }
        })
    }
    catch (error) {
        res.redirect('/')
    }

    if (article == undefined) res.redirect('/')

    res.render('article', { article: article })
})

app.listen(8080, () => {
    console.log("App is running")
})