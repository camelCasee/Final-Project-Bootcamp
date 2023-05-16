const { LengthError } = require("../errors")

module.exports = function stringValidator(string, value = 'string'){
    if (typeof string !== 'string') throw new TypeError(`${value} is not a string`)
    if (!string.length) throw new LengthError(`${value} does not have length`)
}