const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator } } = require('com')
const { Offers, Users } = require('../models')

module.exports = function createOffer(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role !== 'company')
                throw new ConflictError(`user ${user._id} does not have a company role`)

            return Offers.find({ user: userId }).lean()
        })
        .then(offers => {
            if (offers.length >= 3) throw new ConflictError('Your cant have more than 3 offers')

            const data = { title: `My new Offer ${offers.length ? offers.length + 1 : ''}`, description: '', createDate: new Date(), user: userId }

            data.published = false

            return Offers.create(data)
        })
        .then(offer => {
            offer.id = offer._id.toString()
            return offer.id
        })
}