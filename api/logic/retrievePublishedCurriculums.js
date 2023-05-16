const { errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Curriculums, Offers } = require('../models')
/**
 * Retrieves published curriculums
 * 
 * @param {string} userId The user id
 */
module.exports = function retrievePublishedCurriculums(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId).lean()
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)
            else if (user.role !== 'company')
                throw new ConflictError(`user ${user._id} does not have a worker role`)

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

                    return Curriculums.find({ published: true }).where('_id').nin(curriculumsToIgnore).limit(1).sort({ createDate: -1 }).populate('user', '-email -password -role -__v').select('-published -offersIlike -offersTheyLikeMe -__v').lean()
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