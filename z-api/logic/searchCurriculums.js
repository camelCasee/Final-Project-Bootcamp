const {
    errors: { NotFoundError, ConflictError, ContentError },
    validators: { stringValidator }
} = require('com')
const { Users, Curriculums, Offers } = require('../models')
/**
 * Retrieves all user curriculums
 * 
 * @param {string} userId The user id
 */
module.exports = function searchCurriculums(userId, keyWord = '', location = '') {
    stringValidator(userId, 'userId')
    if (keyWord) stringValidator(keyWord, 'key word')
    if (location) stringValidator(location, 'location')
    if (!keyWord && !location) throw new ContentError('introduce a field to search')

    return Users.findById(userId).lean()
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role !== 'company')
                throw new ConflictError('user is not a company')

            const dislikesArray = user.dislikes ? user.dislikes : []

            return Offers.find({ user: userId }).lean()
                .then(offers => {
                    const likesArray = offers.reduce((acumulator, offers) => {
                        if (offers.curriculumsILike) {
                            acumulator.push(...offers.curriculumsILike)

                            return acumulator
                        } else
                            return acumulator.concat()
                    }, [])

                    const curriculumsToIgnore = dislikesArray.concat(likesArray)

                    const queryToSearch = new RegExp(keyWord, 'i')

                    const locationToSearch = new RegExp(location, 'i')

                    if (location) {
                        return Curriculums.find({
                            'published': true,
                            'location': locationToSearch,
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
                        }).where('_id').nin(curriculumsToIgnore).limit(1).sort({ createDate: -1 }).populate('user', 'name').select('-__v').lean()
                    }
                    else if (!location) {
                        return Curriculums.find({
                            'published': true,
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
                        }).where('_id').nin(curriculumsToIgnore).limit(1).sort({ createDate: -1 }).populate('user', 'name').select('-offersIlike -offersTheyLikeMe -__v').lean()
                    }
                })
        })
        .then(curriculums => {
            curriculums.forEach(curriculum => {
                if (curriculum.languages) {
                    curriculum.languages.forEach(language => {
                        language.id = language._id.toString()

                        delete language._id
                    })
                }
                if (curriculum.experiences) {
                    curriculum.experiences.forEach(experience => {
                        experience.id = experience._id.toString()

                        delete experience._id
                    })
                }
                if (curriculum.studies) {
                    curriculum.studies.forEach(study => {
                        study.id = study._id.toString()

                        delete study._id
                    })
                }
                if (curriculum.knowledges) {
                    curriculum.knowledges.forEach(knowledge => {
                        knowledge.id = knowledge._id.toString()

                        delete knowledge._id
                    })
                }
                if (!curriculum.user.id) {
                    delete curriculum.user._id
                }

                curriculum.id = curriculum._id.toString()
                delete curriculum._id
            })

            return curriculums
        })
}