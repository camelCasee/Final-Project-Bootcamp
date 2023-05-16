const { LengthError } = require("../errors")

module.exports = function titleValidator(title){
    if (typeof title !== 'string') throw new TypeError('title is not a string')
    if (!title.length) throw new LengthError('title does not have length')
    if (title.length > 25) throw new LengthError('title length is higher than 25')

}