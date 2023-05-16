const { LengthError, ContentError } = require("../errors")

module.exports = function ofExperienceValidator(ofExperiences) {
    ofExperiences.forEach(ofExperience => {
        const years = parseInt(ofExperience.years)
        if (typeof ofExperience.position !== 'string') throw new TypeError('position is not a string')
        if (!ofExperience.position.length) throw new LengthError('position does not have length')

        if(!years) throw new ContentError('Put a valid year')
        // if (typeof ofExperience.industry !== 'string') throw new TypeError('industry is not a string')
        // if (!ofExperience.industry.length) throw new LengthError('industry does not have length')
    })
}