const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", async (req, res) => {
    const users = await User.findAll()

    res.render("admin/users/index", { users: users })
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

router.post("/admin/users/delete", async (req, res) => {
    const userId = req.body.id

    if (userId == undefined) res.redirect('/admin/users')
    if (isNaN(userId)) res.redirect('/admin/users')

    await User.destroy({
        where: { id: userId }
    })

    res.redirect('/admin/users')
})

router.post("/users/create", async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const emailExists = await User.findOne({ where: { email: email }})

    if (emailExists) {
        res.redirect('/admin/users/create')
        return
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const userCreated = await User.create({
        email: email,
        password: hash
    })

    userCreated ? res.redirect('/admin/users') : res.redirect('/')
})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({
        where: { email: email }
    })

    if (!user) {
        res.redirect('/login')
        return
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.password)
    if (!isPasswordCorrect) {
        req.redirect('/login')
        return
    }

    req.session.user = {
        id: user.id,
        email: user.email
    }
    res.json(req.session.user)
})


module.exports = router