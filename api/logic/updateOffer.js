const {
    errors: { NotFoundError, ConflictError, ContentError },
    validators: { stringValidator, languagesValidator, ofStudyValidator, ofExperienceValidator,
        knowledgeValidator, booleanValidator, modalityValidator, salaryValidator, workTimeValidator,
        titleValidator, descriptionValidator, locationValidator } } = require('com')
const { Users, Offers } = require('../models')

module.exports = function updateOffer(userId, offerId, title, description, photo, modality, location, salary, workTime, languages, studies, experiences, knowledges, published) {
    stringValidator(userId, 'userId')
    stringValidator(offerId, 'offerId')
    if (title) titleValidator(title, 'title')
    if (description) descriptionValidator(description)
    if (photo) stringValidator(photo, 'photo')
    if (modality) modalityValidator(modality)
    if (location) locationValidator(location)
    if (salary) salaryValidator(salary)
    if (workTime) workTimeValidator(workTime)
    if (languages) languagesValidator(languages)
    if (studies) ofStudyValidator(studies)
    if (experiences) ofExperienceValidator(experiences)
    if (knowledges) knowledgeValidator(knowledges)
    if (typeof published === 'boolean') booleanValidator(published, 'published')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Offers.findById(offerId)
        })
        .then(offer => {
            if (!offer) throw new NotFoundError(`offer with id ${offerId} does not exist`)

            if (offer.user.toString() !== userId) throw new ConflictError(`offer with id ${offerId} does not belong to user with id ${userId}`)

            const data = { createDate: new Date() }

            if (title) data.title = title
            if (description || description === '') data.description = description
            if (photo) data.photo = photo
            if (modality) data.modality = modality
            if (location || location === '') data.location = location
            if (salary) data.salary = salary
            if (workTime) data.workTime = workTime
            if (languages) data.languages = languages
            if (studies) data.studies = studies
            if (experiences) data.experiences = experiences
            if (experiences) data.experiences = experiences
            if (knowledges) data.knowledges = knowledges
            if (typeof published === 'boolean') {
                if (published) {
                    if (offer.description.length < 5)
                        throw new ContentError('to publish put a description with a length higher than 5')

                    if (!offer.location)
                        throw new ContentError('to publish put a location')

                    else if (!offer.workTime && !offer.modality && !offer.salary)
                        throw new ContentError('to publish put at least one of these: Work time, modality or salary')

                    else if (offer.experiences.length === 0 && offer.studies.length === 0 && offer.languages.length === 0 && offer.knowledges.length === 0)
                        throw new ContentError('to publish put at least one of these: experience, study, languages or knowledges')

                    data.published = published

                    return Offers.findByIdAndUpdate(offerId, data)
                }
                data.published = published

                return Offers.findByIdAndUpdate(offerId, data)
            }
            if (offer.published) throw new ConflictError('You cant update a published offer')

            return Offers.findByIdAndUpdate(offerId, data)
        })
}
