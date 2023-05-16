const {
    errors: { ConflictError, UnexpectedError },
    validators: { nameValidator, emailValidator, passwordValidator, roleValidator }
} = require('com')
const { Users } = require('../models')

module.exports = function registerUser(name, email, password, role) {
    nameValidator(name)
    emailValidator(email)
    passwordValidator(password)
    roleValidator(role)

    return Users.create({ name, email, password, role })
        .catch(error => {
            if (error.message.includes('E11000'))
                throw new ConflictError(`user with email ${email} already exists`)

            throw new UnexpectedError(error.message)
        })
}
