const { errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Offers, Curriculums } = require('../models')
/**
 * Retrieves published offers
 * 
 * @param {string} userId The user id
 */
module.exports = function retrievePublishedOffers(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId).lean()
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)
            else if (user.role !== 'worker')
                throw new ConflictError(`user ${user._id} does not have a worker role`)

            const dislikesArray = user.dislikes ? user.dislikes : []

            return Curriculums.find({ user: userId }).lean()
                .then(curriculums => {
                    const likesArray = curriculums.reduce((acumulator, curriculum) => {
                        if (curriculum.offersILike) {
                            acumulator.push(...curriculum.offersILike)

                            return acumulator
                        } else
                            return acumulator.concat()
                    }, [])

                    const offersToIgnore = dislikesArray.concat(likesArray)

                    return Offers.find({ published: true }).where('_id').nin(offersToIgnore).limit(1).sort({ createDate: -1 }).populate('user', '-email -password -role -__v').select('-published -curriculumsIlike -curriculumsTheyLikeMe -__v').lean()
                })
        })
        .then(offers => {
            offers.forEach(offer => {
                if (offer.languages) {
                    offer.languages.forEach(language => {
                        language.id = language._id.toString()

                        delete language._id
                    })
                }
                if (offer.experiences) {
                    offer.experiences.forEach(experience => {
                        experience.id = experience._id.toString()

                        delete experience._id
                    })
                }
                if (offer.studies) {
                    offer.studies.forEach(study => {
                        study.id = study._id.toString()

                        delete study._id
                    })
                }
                if (offer.knowledges) {
                    offer.knowledges.forEach(knowledge => {
                        knowledge.id = knowledge._id.toString()

                        delete knowledge._id
                    })
                }
                if (offer.salary) {
                    offer.salary.id = offer.salary._id.toString()

                    delete offer.salary._id
                }

                if (!offer.user.id) {
                    delete offer.user._id
                }

                offer.id = offer._id.toString()
                delete offer._id
            })

            return offers
        })
}