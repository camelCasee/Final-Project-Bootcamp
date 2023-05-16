const { Schema } = require('mongoose')
const { Types: { ObjectId } } = Schema
const language = require('./curriculums/cvLanguage')
const study = require('./curriculums/cvStudy')
const experience = require('./curriculums/cvExperience')
const knowledge = require('./curriculums/cvKnowledge')

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
    location: {
        type: String
    },
    createDate: {
        type: Date,
        required: true
    },
    languages: [language],

    studies: [study],

    experiences: [experience],

    knowledges: [knowledge],

    published: {
        type: Boolean,
    },

    offersILike: {
        type: [ObjectId]
    },

    offersTheyLikeMe: {
        type: [ObjectId]
    },

    user: {
        type: ObjectId,
        ref: 'Users',
        required: true
    }
})