const { errors: { NotFoundError },
    validators: { stringValidator }
} = require('com')
const { Users } = require('../models')

module.exports = function retrieveUser(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId).select('-password').lean()
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            user.id = user._id.toString()

            delete user._id

            return user
        })
}
