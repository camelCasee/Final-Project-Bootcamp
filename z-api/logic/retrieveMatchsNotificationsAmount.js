const { errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Matchs, Curriculums, Offers } = require('../models')
/**
 * Retrieves user matchs notifications
 * 
 * @param {string} userId The user id
 */
module.exports = function retrieveMatchsNotificationsAmount(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role === 'company') {
                return Offers.find({ user: userId }).lean()
                    .then(offers => {
                        if (offers.length) {
                            let offersId = offers?.length ? offers.map(offer => offer._id.toString()) :
                                [offers._id.toString()]

                            return Matchs.updateMany({
                                $and: [
                                    {
                                        offer: { $in: offersId }
                                    },
                                    {
                                        companyNotified: { $ne: true }
                                    }
                                ]
                            },
                                {
                                    $set: { companyNotified: true }
                                })
                                .then(matchsAmounts => {

                                    return { amountOfNotifications: matchsAmounts.modifiedCount }
                                })
                        }

                        return { amountOfNotifications: 0 }
                    })
            }
            else if (user.role === 'worker') {
                return Curriculums.find({ user: userId }).lean()
                    .then(curriculums => {
                        if (curriculums.length) {
                            let curriculumsId = curriculums?.length ? curriculums.map(curriculum => curriculum._id.toString()) :
                                [curriculums._id.toString()]

                            return Matchs.updateMany({
                                $and: [
                                    {
                                        curriculum: { $in: curriculumsId }
                                    },
                                    {
                                        workerNotified: { $ne: true }
                                    }
                                ]
                            },
                                {
                                    $set: { workerNotified: true }
                                })
                                .then(matchsAmounts => {

                                    return { amountOfNotifications: matchsAmounts.modifiedCount }
                                })
                        }

                        return { amountOfNotifications: 0 }
                    })
            }
        })
}