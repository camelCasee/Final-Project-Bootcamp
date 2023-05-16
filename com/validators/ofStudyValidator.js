const { LengthError } = require("../errors")

module.exports = function ofStudyValidator(ofStudies) {
    ofStudies.forEach(ofStudy => {
        if (typeof ofStudy.title !== 'string') throw new TypeError('title is not a string')
        if (!ofStudy.title.length) throw new LengthError('title does not have length')
    })
}