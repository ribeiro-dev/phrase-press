const express = require('express')
const router = express.Router() // create router instance
const slugify = require('slugify')

const Category = require('./Category')


router.get('/admin/categories', (req, res) => {

    Category.findAll().then(categories => {
        res.render('admin/categories/index', { categories: categories })
    })
})

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
});

router.post('/categories/save', (req, res) => {
    var title = req.body.title

    if (title == undefined) {
        res.redirect('/admin/categories/new')
    }

    Category.create({
        title: title,
        slug: slugify(title, {
            lower: true
        })
    })
    .then(() => {
        res.redirect('/')
    })
})

router.post('/categories/delete', (req, res) => {
    const categoryId = req.body.id

    if (categoryId == undefined) res.redirect('/admin/categories')
    if (isNaN(categoryId)) res.redirect('/admin/categories')

    Category.destroy({
        where: {
            id: categoryId
        }
    })
    .then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router