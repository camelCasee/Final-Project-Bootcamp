const { Schema } = require('mongoose')
const { Types: { ObjectId } } = Schema
const language = require('./offers/ofLanguage')
const study = require('./offers/ofStudy')
const experience = require('./offers/ofExperience')
const knowledge = require('./offers/ofKnowledge')
const salary = require('./offers/ofSalary')

module.exports = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    photo: {
        type: String
    },
    createDate: {
        type: Date,
        required: true
    },
    modality: {
        type: String,
        enum: ['remote', 'face-to-face', 'hybrid']
    },
    location: {
        type: String
    },
    salary: salary,

    workTime: {
        type: String,
        enum: ['part time', 'full time']
    },
    languages: [language],

    studies: [study],

    experiences: [experience],

    knowledges: [knowledge],

    published: {
        type: Boolean,
    },

    curriculumsILike: {
        type: [ObjectId]
    },

    curriculumsTheyLikeMe: {
        type: [ObjectId]
    },

    user: {
        type: ObjectId,
        ref: 'Users',
        required: true
    }
})