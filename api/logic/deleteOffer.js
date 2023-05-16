const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Offers, Curriculums, Matchs } = require('../models')

module.exports = function deleteOffer(userId, offerId) {
    stringValidator(userId, 'userId')
    stringValidator(offerId, 'offerId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Offers.findById(offerId)
        })
        .then(offer => {
            if (!offer) throw new NotFoundError(`offer with id ${offerId} does not exist`)

            if (offer.user.toString() !== userId) throw new ConflictError(`offer with id ${offerId} does not belong to user with id ${userId}`)

            return Promise.all([Offers.findByIdAndDelete(offerId),
            Curriculums.updateMany({ $or: [{ offersILike: offerId }, { offersTheyLikeMe: offerId }] },
                { $pull: { 'offersTheyLikeMe': offerId, 'offersILike': offerId }}),
            Users.updateMany({ dislikes: offerId }, { $pull: { 'dislikes': offerId } }),
            Matchs.deleteMany({ offer: offerId })])
        })
}
