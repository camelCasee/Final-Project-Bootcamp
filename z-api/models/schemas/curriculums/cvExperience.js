const { Schema } = require('mongoose')

module.exports = new Schema({
    place:{
        type: String
    },
    position: {
        type: String
    },
    from:{
        type: Date
    },
    to:{
        type: Date
    }
})