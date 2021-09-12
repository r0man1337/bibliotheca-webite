const path = require('path')
const express = require('express')
const app = express()
const jsonServer = require('json-server')

const router = jsonServer.router(path.join(__dirname, 'db.json'))

app.use(express.json())
app.use('/', jsonServer.defaults([{ id: 'lootId' }]), router)

app.listen(3001)

module.exports = app
