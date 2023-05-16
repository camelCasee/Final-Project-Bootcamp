const { errors: { NotFoundError },
    validators: { stringValidator }
} = require('com')
const { Users, Matchs, Curriculums, Offers } = require('../models')
/**
 * Retrieves user matchs
 * 
 * @param {string} userId The user id
 */
module.exports = function retrieveMatchs(userId) {
    stringValidator(userId, 'userId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            if (user.role === 'company') {
                return Offers.find({ user: userId }).lean()
                    .then(offers => {
                        if (offers) {
                            const offersArray = offers.reduce((accumulator, offers) => {
                                accumulator.push(offers._id.toString())

                                return accumulator
                            }, [])
                            return Matchs.find({
                                $and: [
                                    {
                                        offer: { $in: offersArray }
                                    },
                                    {
                                        notified: { $ne: true }
                                    }
                                ]
                            }).populate({
                                path: 'curriculum',
                                populate:[{
                                    path: 'user',
                                    select: 'name'
                                }]
                            }).populate('offer', 'title').select('-__v').lean()
                                .then(matchs => {
                                    matchs.forEach(match => {
                                        if (match.curriculum?.languages) {
                                            match.curriculum.languages.forEach(language => {

                                                delete language._id
                                            })
                                        }
                                        if (match.curriculum?.experiences) {
                                            match.curriculum.experiences.forEach(experience => {

                                                delete experience._id
                                            })
                                        }
                                        if (match.curriculum?.studies) {
                                            match.curriculum.studies.forEach(study => {

                                                delete study._id
                                            })
                                        }
                                        if (match.curriculum?.knowledges) {
                                            match.curriculum.knowledges.forEach(knowledge => {

                                                delete knowledge._id
                                            })
                                        }
                                        if (!match.curriculum.id)
                                            match.curriculum.id = match.curriculum._id.toString()

                                        if (!match.offer.id)
                                            match.offer.id = match.offer._id.toString()

                                        delete match.curriculum.user._id
                                        delete match.offer._id
                                        delete match.curriculum.curriculumsILike
                                        delete match.curriculum.curriculumsTheyLikeMe
                                        delete match.curriculum.__v
                                        delete match.curriculum._id
                                        delete match._id
                                    })

                                    return matchs
                                })
                        }
                    })
            }

            else if (user.role === 'worker') {
                return Curriculums.find({ user: userId }).lean()
                    .then(curriculums => {
                        if (curriculums) {
                            const curriculumsArray = curriculums.reduce((accumulator, curriculums) => {
                                accumulator.push(curriculums._id.toString())

                                return accumulator
                            }, [])
                            return Matchs.find({
                                $and: [
                                    {
                                        curriculum: { $in: curriculumsArray }
                                    },
                                    {
                                        notified: { $ne: true }
                                    }
                                ]
                            }).populate({
                                path: 'offer',
                                populate:[{
                                    path: 'user',
                                    select: 'name'
                                }]
                            }).populate('curriculum', 'title').select('-__v').lean()
                                .then(matchs => {
                                    matchs.forEach(match => {
                                        if (match.offer?.languages) {
                                            match.offer.languages.forEach(language => {

                                                delete language._id
                                            })
                                        }
                                        if (match.offer?.experiences) {
                                            match.offer.experiences.forEach(experience => {

                                                delete experience._id
                                            })
                                        }
                                        if (match.offer?.studies) {
                                            match.offer.studies.forEach(study => {

                                                delete study._id
                                            })
                                        }
                                        if (match.offer?.knowledges) {
                                            match.offer.knowledges.forEach(knowledge => {

                                                delete knowledge._id
                                            })
                                        }
                                        if (!match.offer.id)
                                            match.offer.id = match.offer._id.toString()

                                        if (!match.curriculum.id)
                                            match.curriculum.id = match.curriculum._id.toString()

                                        delete match.offer.user._id
                                        delete match.curriculum._id
                                        delete match.offer.curriculumsILike
                                        delete match.offer.curriculumsTheyLikeMe
                                        delete match.offer.__v
                                        delete match.offer._id
                                        delete match._id
                                    })

                                    return matchs
                                })
                        }
                    })
            }
        })
}