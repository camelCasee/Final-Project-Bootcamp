const { LengthError, FormatError, ContentError } = require("../errors")

module.exports = function salaryValidator(salaryObject) {
    if (!(salaryObject instanceof Object)) throw new TypeError('Salary object is not an object')
    const { salary, currency } = salaryObject

    if (!salary) throw new ContentError('Put a valid salary')

    if (typeof currency !== 'string') throw new TypeError(`${currency} is not a string`)
    if (!currency.length) throw new LengthError(`${currency} does not have length`)
    if (currency !== '$' && currency !== '€') throw new FormatError('invalid currency')
}