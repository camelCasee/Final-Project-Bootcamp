const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator } } = require('com')
const { Users, Curriculums, Offers, Matchs } = require('../models')

module.exports = function updateCurriculum(userId, documentId) {
    stringValidator(userId, 'userId')
    stringValidator(documentId, 'documentId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            const alreadyDislike = user.dislikes?.some(dislike => dislike.toString() === documentId)

            if (alreadyDislike) throw new ConflictError('you already dislike this document')

            if (user.role === 'worker') {
                return Curriculums.find({
                    $and: [
                        {
                            user: userId
                        },
                        {
                            offersILike: documentId
                        }
                    ]
                }).lean()
                    .then(([curriculums]) => {

                        if (curriculums) {
                            const curriculumsId = curriculums?.length ? curriculums.map(curriculum => curriculum._id.toString()) :
                                [curriculums._id.toString()]

                            return Promise.all([
                                Curriculums.updateMany({ user: userId }, { $pull: { offersILike: documentId } }),
                                Offers.findByIdAndUpdate(documentId, { $pull: { curriculumsTheyLikeMe: { $in: curriculumsId } } }),
                                Users.findByIdAndUpdate(userId, { $push: { 'dislikes': documentId } }),
                                Matchs.deleteOne({
                                    $and: [
                                        {
                                            offer: documentId
                                        },
                                        {
                                            curriculum: { $in: curriculumsId }
                                        }
                                    ]
                                })
                            ])
                        }
                        else {
                            return Users.findByIdAndUpdate(userId, { $push: { 'dislikes': documentId } })
                        }

                    })
            }
            else if (user.role === 'company') {
                return Offers.find({
                    $and: [
                        {
                            user: userId
                        },
                        {
                            curriculumsILike: documentId
                        }
                    ]
                }).lean()
                    .then(([offers]) => {

                        if (offers) {
                            const offersId = offers?.length ? offers.map(offer => offer._id.toString()) :
                                [offers._id.toString()]

                            return Promise.all([
                                Offers.updateMany({ user: userId }, { $pull: { curriculumsILike: documentId } }),
                                Curriculums.findByIdAndUpdate(documentId, { $pull: { offersTheyLikeMe: { $in: offersId } } }),
                                Users.findByIdAndUpdate(userId, { $push: { 'dislikes': documentId } }),
                                Matchs.deleteOne({
                                    $and: [
                                        {
                                            curriculum: documentId
                                        },
                                        {
                                            offer: { $in: offersId }
                                        }
                                    ]
                                })
                            ])
                        }
                        else {
                            return Users.findByIdAndUpdate(userId, { $push: { 'dislikes': documentId } })
                        }

                    })
            }
        })
}