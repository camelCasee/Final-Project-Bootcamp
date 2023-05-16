const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator } } = require('com')
const { Users, Offers, Curriculums, Matchs } = require('../models')

module.exports = function updateCurriculum(userId, curriculumId, offerId) {
    stringValidator(userId, 'userId')
    stringValidator(curriculumId, 'curriculumId')
    stringValidator(offerId, 'offerId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Promise.all([Curriculums.findById(curriculumId).lean(), Offers.findById(offerId).lean()])
        })
        .then(([curriculum, offer]) => {
            if (!curriculum) throw new NotFoundError(`curriculum with id ${curriculumId} does not exist`)
            if (!offer) throw new NotFoundError(`offer with id ${offerId} does not exist`)

            if (curriculum.user.toString() !== userId)
                throw new ConflictError(`curriculum with id ${curriculumId} does not belong to user with id ${userId}`)

            const offerAdded = curriculum.offersILike?.some(offerILike => offerILike.toString() === offerId)

            if (offerAdded) throw new ConflictError('you already like this offer')

            if (curriculum.offersTheyLikeMe) {
                const cvMatched = curriculum.offersTheyLikeMe.some(offerThatLikesMe => offerThatLikesMe.toString() === offerId)

                if (cvMatched) {
                    return Matchs.create({ offer, curriculum })
                        .then(() => {
                            return Promise.all([Curriculums.findByIdAndUpdate(curriculumId, { $push: { 'offersILike': offerId } }),
                            Offers.findByIdAndUpdate(offerId, { $push: { 'curriculumsTheyLikeMe': curriculumId } })])
                        })
                }
            }
            return Promise.all([Curriculums.findByIdAndUpdate(curriculumId, { $push: { 'offersILike': offerId } }),
            Offers.findByIdAndUpdate(offerId, { $push: { 'curriculumsTheyLikeMe': curriculumId } })])
        })
}