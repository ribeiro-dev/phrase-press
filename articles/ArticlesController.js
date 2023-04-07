const express = require('express')
const router = express.Router() // create router instance

router.get('/articles', (req, res) => {
    res.send("ARTICLES ROUTE")
});

router.get('/admin/articles/new', (req, res) => {
    res.send("ROUTE TO CREATE NEW ARTICLE")
})

module.exports = router