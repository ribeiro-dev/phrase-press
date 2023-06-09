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
        res.redirect('/admin/categories')
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

router.get('/admin/categories/edit/:id', (req, res) => {
    const id = req.params.id

    if (isNaN(id)) res.redirect('/admin/categories')

    Category.findByPk(id)
        .then(category => {
            if (category == undefined) res.redirect('/admin/categories')

            res.render('admin/categories/edit', { category: category } )
        })
        .catch(err => {
            res.redirect('/admin/categories')
        })
})

router.post('/categories/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title

    Category.update({
        title: title,
        slug: slugify(title, {
            lower: true
        })
    }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router