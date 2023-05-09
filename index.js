const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UsersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

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
app.use('/', usersController)

app.get('/', async (req, res) => {
    const articles = await Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    })
    const categories = await Category.findAll()

    res.render('index', { articles: articles, categories: categories })
})

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug

    try {
        var article = await Article.findOne({
            where: {
                slug: slug
            }
        })
        var categories = await Category.findAll()

        if (article != undefined) res.redirect('/')
        else res.render('article', { article: article, categories: categories })
    }
    catch (error) {
        res.redirect('/')
    }
})

app.get('/category/:slug', async (req, res) => {
    const slug = req.params.slug

    try {
        var category = await Category.findOne({
            where: {
                slug: slug
            },
            include: [{ model: Article }]
        })
        var categories = await Category.findAll()

    } catch (error) {
        res.redirect('/')
    }

    if (category == undefined) res.redirect('/')

    res.render('index', { articles: category.articles, categories: categories })
})

app.listen(8080, () => {
    console.log("App is running")
})