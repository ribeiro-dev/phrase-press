const express = require('express')
const router = express.Router() // create router instance
const Category = require('../categories/Category');
const Article = require('./Article')
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }] // join
    }).then((articles) => {
        res.render("admin/articles/index", { articles: articles })
    })
});

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", { categories: categories})
    })
})

router.post('/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id

    if (id == undefined || isNaN(id)) res.redirect('/admin/articles')

    Article.destroy({
        where: { id: id }
    })
    .then(() => {
        res.redirect('/admin/articles')
    })
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    const id = req.params.id

    Article.findByPk(id)
        .then(article => {
            if (article == undefined) res.redirect('/')

            Category.findAll().then(categories => {

                res.render('admin/articles/edit', { article: article, categories: categories } )
            })
        })
        .catch(err => {
            res.redirect('/')
        })
})

router.post('/articles/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title, {
            lower:true
        })
    },
    {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(err => {
        res.redirect('/')
    })
})

router.post('/articles/save', (req, res) => {
    const title = req.body.title
    const category = req.body.category
    const body = req.body.body

    Article.create({
        title: title,
        body: body,
        slug: slugify(title, {
            lower: true
        }),
        categoryId: category
    })
    .then(() => {
        res.redirect('/admin/articles')
    })
})

router.get('/articles/page/:num', (req, res) => {
    const page = parseInt(req.params.num)
    const limit = 4
    let offset

    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = (page - 1) * limit;
    }

    Article.findAndCountAll({
        limit: limit,
        offset: offset
    }).then(articles => {
        let next
        if (offset + limit >= articles.count) {
            next = false
        } else {
            next = true
        }

        const result = {
            next: next,
            articles: articles,
            page: page
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {
                result: result,
                categories: categories
            })
        })
    })
})

module.exports = router