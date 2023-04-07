const express = require('express')
const router = express.Router() // create router instance

router.get('/categories', (req, res) => {
    res.send("CATEGORIES ROUTE")
});

router.get('/admin/categories/new', (req, res) => {
    res.send("ROUTE TO CREATE NEW CATEGORY")
})

module.exports = router