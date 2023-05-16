const { errors: { NotFoundError },
    validators: { stringValidator }
} = require('com')
const { Users, Curriculums } = require('../models')
/**
 * Retrieves all user curriculums
 * 
 * @param {string} userId The user id
 */
module.exports = function retrieveUserCurriculums(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Curriculums.find({ user: userId }).sort({ createDate: -1 }).populate('user', '-email -password -__v').select('-description -location -languages -studies -experiences -knowledges -__v').lean()
        })
        .then(curriculums => {
            curriculums.forEach(curriculum => {
                if (!curriculum.user.id) {
                    curriculum.user.id = curriculum.user._id.toString()
                    delete curriculum.user._id
                }

                curriculum.id = curriculum._id.toString()
                delete curriculum._id
            })

            return curriculums
        })
}