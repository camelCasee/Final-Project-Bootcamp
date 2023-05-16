const { LengthError, FormatError } = require("../errors")
const { IS_EMAIL_REGEX } = require("../regex")

module.exports = function emailValidator(email){
    if(!email.length) throw new LengthError('email does not have length')
    if (typeof email !== 'string') throw new TypeError('email is not a string')
    if (!IS_EMAIL_REGEX.test(email)) throw new FormatError('email is not valid')
}