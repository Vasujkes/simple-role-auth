const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
require('dotenv').config()
const app = express()
const port = 3000


app.use(express.json())
app.use('/auth', authRouter)
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3lwod.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()
