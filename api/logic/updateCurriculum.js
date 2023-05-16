const {
    errors: { NotFoundError, ConflictError, ContentError },
    validators: { stringValidator, languagesValidator, cvStudyValidator, cvExperienceValidator,
        knowledgeValidator, booleanValidator, titleValidator, descriptionValidator, locationValidator } } = require('com')
const { Users, Curriculums } = require('../models')

module.exports = function updateCurriculum(userId, curriculumId, title, description, photo, location, languages, studies, experiences, knowledges, published) {
    stringValidator(userId, 'userId')
    stringValidator(curriculumId, 'curriculumId')
    if (title) titleValidator(title, 'title')
    if (description) descriptionValidator(description)
    if (photo) stringValidator(photo, 'photo')
    if (location) locationValidator(location)
    if (languages) languagesValidator(languages)
    if (studies) cvStudyValidator(studies)
    if (experiences) cvExperienceValidator(experiences)
    if (knowledges) knowledgeValidator(knowledges)
    if (typeof published === 'boolean') booleanValidator(published, 'published')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Curriculums.findById(curriculumId)
        })
        .then(curriculum => {
            if (!curriculum) throw new NotFoundError(`curriculum with id ${curriculumId} does not exist`)

            if (curriculum.user.toString() !== userId) throw new ConflictError(`curriculum with id ${curriculumId} does not belong to user with id ${userId}`)

            const data = { createDate: new Date() }

            if (title) data.title = title
            if (description || description === '') data.description = description
            if (photo) data.photo = photo
            if (location || location === '') data.location = location
            if (languages) data.languages = languages
            if (studies) data.studies = studies
            if (experiences) data.experiences = experiences
            if (knowledges) data.knowledges = knowledges
            if (typeof published === 'boolean') {
                if (published) {
                    if (curriculum.description.length < 5)
                        throw new ContentError('to publish put a description with a length higher than 5')

                    if (!curriculum.location)
                        throw new ContentError('to publish put a location')

                    else if (curriculum.experiences.length === 0 && curriculum.studies.length === 0 && curriculum.languages.length === 0 && curriculum.knowledges.length === 0)
                        throw new ContentError('to publish put at least one of these: experience, study, languages or knowledges')

                    data.published = published

                    return Curriculums.findByIdAndUpdate(curriculumId, data)
                }
                data.published = published

                return Curriculums.findByIdAndUpdate(curriculumId, data)
            }
            if (curriculum.published) throw new ConflictError('You cant update a published curriculum')

            return Curriculums.findByIdAndUpdate(curriculumId, data)
        })
}
