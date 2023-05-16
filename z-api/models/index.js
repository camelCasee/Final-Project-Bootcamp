const { model } = require('mongoose')
const { users, offers, curriculums, matchs } = require('./schemas')

const Users = model('Users', users)
const Offers = model('Offers', offers)
const Curriculums = model('Curriculums', curriculums)
const Matchs = model('Matchs', matchs)

module.exports = {
    Users,
    Offers,
    Curriculums,
    Matchs
}