const express = require('express')
const router = express.Router() // create router instance
const Category = require('../categories/Category')

router.get('/articles', (req, res) => {
    res.send("ARTICLES ROUTE")
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
            res.render("admin/articles/new", { categories: categories})
        })
})

module.exports = router