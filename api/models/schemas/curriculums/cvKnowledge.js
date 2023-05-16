const { Schema } = require('mongoose')

module.exports = new Schema({
    title: {
        type: String,
    },
    level: {
        type: String,
        enum: ['low', 'medium', 'high', 'master']
    }
})