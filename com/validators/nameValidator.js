const { LengthError, FormatError } = require("../errors")
const { IS_ALPHABETICAL_REGEX } = require("../regex")

module.exports = function nameValidator(name){
    if (!name.length) throw new LengthError('does not have length')
    if (typeof name !== 'string') throw new TypeError('name is not a string')
    if (!IS_ALPHABETICAL_REGEX.test(name)) throw new FormatError('name is not alphabetical')
}