const express = require("express")
const router = express.Router()
const User = require("./User")
const bcrypt = require("bcryptjs")

router.get("/admin/users", (req, res) => {
    res.send("Users List")
})

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
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

module.exports = router