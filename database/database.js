require('dotenv').config()

const Sequelize = require('sequelize')

const connection = new Sequelize(process.env.DB_TABLE, process.env.DB_USER, process.env.DB_PSSWD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection
