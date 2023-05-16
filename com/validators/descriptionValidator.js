const { LengthError } = require("../errors")

module.exports = function descriptionValidator(description){
    if (typeof description !== 'string') throw new TypeError('description is not a string')
    if (description.length > 140) throw new LengthError('description length is higher than 140')
}