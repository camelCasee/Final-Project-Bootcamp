const {
    errors: { NotFoundError, ConflictError, ContentError },
    validators: { stringValidator }
} = require('com')
const { Users, Offers, Curriculums } = require('../models')
/**
 * Retrieves all user offers
 * 
 * @param {string} userId The user id
 */
module.exports = function searchOffers(userId, keyWord = '', location = '') {
    stringValidator(userId, 'userId')
    if (keyWord) stringValidator(keyWord, 'key word')
    if (location) stringValidator(location, 'location')
    if (!keyWord && !location) throw new ContentError('introduce a field to search')

    return Users.findById(userId).lean()
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role !== 'worker')
                throw new ConflictError('user is not a woker')

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

                    const queryToSearch = new RegExp(keyWord, 'i')

                    const locationToSearch = new RegExp(location, 'i')

                    return Offers.find({
                        'published': true,
                        $and: [{
                            $or: [
                                { 'modality': 'remote' },
                                { 'location': locationToSearch }
                            ]
                        }],
                        $or: [
                            {
                                'title': { $regex: queryToSearch }
                            },
                            {
                                'experiences.position': { $regex: queryToSearch }
                            },
                            {
                                'studies.title': { $regex: queryToSearch }
                            },
                            {
                                'knowledges.title': { $regex: queryToSearch }
                            },
                            {
                                'languages.language': { $regex: queryToSearch }
                            }
                        ]
                    }).where('_id').nin(offersToIgnore).limit(1).sort({ createDate: -1 }).populate('user', 'name').select('-curriculumsIlike -curriculumsTheyLikeMe -__v').lean()
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