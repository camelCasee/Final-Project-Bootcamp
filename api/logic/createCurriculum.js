const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator } } = require('com')
const { Curriculums, Users } = require('../models')

module.exports = function createCurriculum(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role !== 'worker')
                throw new ConflictError(`user ${user._id} does not have a worker role`)

            return Curriculums.find({ user: userId }).lean()
        })
        .then(curriculums => {
            if (curriculums.length >= 3) throw new ConflictError('Your cant have more than 3 curriculums')

            const data = { title: `My new CV ${curriculums.length ? curriculums.length + 1 : ''}`, description: '', createDate: new Date(), user: userId }

            data.published = false

            return Curriculums.create(data)
        })
        .then(curriculum => {
            curriculum.id = curriculum._id.toString()
            return curriculum.id
        })
}