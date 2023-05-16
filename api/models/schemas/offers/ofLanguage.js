const { Schema } = require('mongoose')

module.exports = new Schema({
    language: {
        type: String,
        enum: ['Chinese', 'English', 'French', 'German', 'Italian', 'Japanese', 'Spanish', 'Portuguese']
    },
    level: {
        type: String,
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    }
})