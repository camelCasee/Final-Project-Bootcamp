const { LengthError, ConflictError } = require("../errors")

module.exports = function cvExperienceValidator(cvExperiences) {
    cvExperiences.forEach(cvExperience => {
        if (typeof cvExperience.place !== 'string') throw new TypeError('place is not a string')
        if (!cvExperience.place.length) throw new LengthError('place does not have length')

        if (typeof cvExperience.position !== 'string') throw new TypeError('position is not a string')
        if (!cvExperience.position.length) throw new LengthError('position does not have length')

        if(!cvExperience.from) throw new LengthError('Put a start date')
        if (Object.prototype.toString.call(cvExperiences.from) === "[object Date]" && !isNaN(cvExperiences.from)) throw new TypeError('from is not a date')

        if(!cvExperience.to) throw new LengthError('Put a end date')
        if (Object.prototype.toString.call(cvExperiences.to) === "[object Date]" && !isNaN(cvExperiences.to)) throw new TypeError('to is not a date')

        if(cvExperience.from > cvExperience.to) throw new ConflictError('date "To" must be higher than date "From"')
    })
}