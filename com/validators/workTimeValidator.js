const { LengthError, FormatError } = require("../errors")

module.exports = function workTimeValidator(workTime){
    if (typeof workTime !== 'string') throw new TypeError('work time is not a string')
    if (!workTime.length) throw new LengthError('does not have length')
    if (workTime !== 'part time' && workTime !== 'full time') throw new FormatError('invalid work time')
}