const { LengthError, FormatError } = require("../errors")
const { HAS_SPACES_REGEX } = require("../regex")

module.exports = function passwordValidator(password){
    if (typeof password !== 'string') throw new TypeError('password is not a string')
    if (password.length < 7) throw new LengthError('password length is less than 7')
    if (HAS_SPACES_REGEX.test(password)) throw new FormatError('password has spaces')
}