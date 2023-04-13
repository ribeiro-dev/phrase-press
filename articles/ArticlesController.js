const express = require('express')
const router = express.Router() // create router instance
const Category = require('../categories/Category');
const Article = require('./Article')
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    res.send("ARTICLES ROUTE")
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
            res.render("admin/articles/new", { categories: categories})
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

module.exports = router