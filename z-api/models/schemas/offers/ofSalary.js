const { Schema } = require('mongoose')

module.exports = new Schema({
    salary: {
        type: Number,
    },
    currency:{
        type: String,
        enum:['$', '€']
    }
})