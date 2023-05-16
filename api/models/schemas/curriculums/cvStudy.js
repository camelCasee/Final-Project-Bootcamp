const { Schema } = require('mongoose')

module.exports = new Schema({
    institution:{
        type: String
    },
    title: {
        type: String
    },
    from:{
        type: Date
    },
    to:{
        type: Date
    }
})