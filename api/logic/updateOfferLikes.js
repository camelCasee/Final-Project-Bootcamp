const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator } } = require('com')
const { Users, Offers, Curriculums, Matchs } = require('../models')

module.exports = function updateOffer(userId, offerId, curriculumId) {
    stringValidator(userId, 'userId')
    stringValidator(offerId, 'offerId')
    stringValidator(curriculumId, 'curriculumId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Promise.all([Offers.findById(offerId).lean(), Curriculums.findById(curriculumId).lean()])
        })
        .then(([offer, curriculum]) => {
            if (!offer) throw new NotFoundError(`offer with id ${offerId} does not exist`)
            if (!curriculum) throw new NotFoundError(`curriculum with id ${curriculumId} does not exist`)

            if (offer.user.toString() !== userId)
                throw new ConflictError(`offer with id ${offerId} does not belong to user with id ${userId}`)

            const curriculumAdded = offer.curriculumsILike?.some(curriculumILike => curriculumILike.toString() === curriculumId)

            if (curriculumAdded) throw new ConflictError('you already like this curriculum')

            if (offer.curriculumsTheyLikeMe) {
                const offerMatched = offer.curriculumsTheyLikeMe.some(curriculumThatLikesMe => curriculumThatLikesMe.toString() === curriculumId)

                if (offerMatched) {
                    return Matchs.create({ offer, curriculum })
                        .then(() => {
                            return Promise.all([Offers.findByIdAndUpdate(offerId, { $push: { 'curriculumsILike': curriculumId } }),
                            Curriculums.findByIdAndUpdate(curriculumId, { $push: { 'offersTheyLikeMe': offerId } })])
                        })
                }
            }
            return Promise.all([Offers.findByIdAndUpdate(offerId, { $push: { 'curriculumsILike': curriculumId } }),
            Curriculums.findByIdAndUpdate(curriculumId, { $push: { 'offersTheyLikeMe': offerId } })])
        })
}