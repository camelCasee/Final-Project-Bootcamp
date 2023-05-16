const { LengthError } = require("../errors")

module.exports = function descriptionValidator(location){
    if (typeof location !== 'string') throw new TypeError('location is not a string')
    if (location.length > 20) throw new LengthError('location length is higher than 20')
}