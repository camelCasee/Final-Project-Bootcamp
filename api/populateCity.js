require('dotenv').config()

const citiesJson= require('../cities.json')

const mongoose = require('mongoose')
const { MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log(`db connected to ${MONGODB_URL}`)

        return City.deleteMany({})
    })
    .then(() => {
        const array = JSON.parse(citiesJson)

        City.insertMany(array)
    })
    .catch(error => console.log(error))