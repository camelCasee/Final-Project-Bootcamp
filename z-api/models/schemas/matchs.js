const { Schema } = require('mongoose')
const { Types: { ObjectId } } = Schema

module.exports = new Schema({
    offer:{
        type: ObjectId,
        ref: 'Offers',
        required: true
    },
    curriculum:{
        type: ObjectId,
        ref: 'Curriculums',
        required: true
    },
    workerNotified:{
        type: Boolean,
    },
    companyNotified:{
        type: Boolean,
    }
})