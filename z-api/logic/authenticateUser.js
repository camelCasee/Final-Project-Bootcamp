const {
    errors: { NotFoundError, AuthError },
    validators: { emailValidator, passwordValidator}
} = require('com')
const { Users } = require('../models')

/**
 * Authenticates a user
 * 
 * @param {string} email The user email
 * @param {string} password The user password
 */
module.exports = function authenticateUser(email, password) {
    emailValidator(email)
    passwordValidator(password)

    return Users.findOne({ email })
        .then(user => {
            if (!user)
                throw new NotFoundError('user not registered')

            if (user.password !== password)
                throw new AuthError('wrong password')

            return user.id
        })
}

