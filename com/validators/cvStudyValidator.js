const { LengthError, ConflictError } = require("../errors")

module.exports = function cvStudyValidator(cvStudies) {
    cvStudies.forEach(cvStudy => {
        if (typeof cvStudy.institution !== 'string') throw new TypeError('institution is not a string')
        if (!cvStudy.institution.length) throw new LengthError('institution does not have length')

        if (typeof cvStudy.title !== 'string') throw new TypeError('title is not a string')
        if (!cvStudy.title.length) throw new LengthError('title does not have length')

        if(!cvStudy.from) throw new LengthError('Put a start date')
        if (Object.prototype.toString.call(cvStudies.from) === "[object Date]" && !isNaN(cvStudies.from)) throw new TypeError('from is not a date')

        if(!cvStudy.to) throw new LengthError('Put a end date')
        if (Object.prototype.toString.call(cvStudies.to) === "[object Date]" && !isNaN(cvStudies.to)) throw new TypeError('to is not a date')

        if(cvStudy.from > cvStudy.to) throw new ConflictError('date "To" must be higher than date "From"')
    })
}