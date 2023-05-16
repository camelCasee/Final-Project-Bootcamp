const {
    errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Curriculums, Offers, Matchs } = require('../models')

module.exports = function deleteCurriculum(userId, curriculumId) {
    stringValidator(userId, 'userId')
    stringValidator(curriculumId, 'curriculumId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Curriculums.findById(curriculumId)
        })
        .then(curriculum => {
            if (!curriculum) throw new NotFoundError(`curriculum with id ${curriculumId} does not exist`)

            if (curriculum.user.toString() !== userId) throw new ConflictError(`curriculum with id ${curriculumId} does not belong to user with id ${userId}`)

            return Promise.all([Curriculums.findByIdAndDelete(curriculumId),
            Offers.updateMany({ $or: [{ curriculumsILike: curriculumId }, { curriculumsTheyLikeMe: curriculumId }] },
                { $pull: { 'curriculumsTheyLikeMe': curriculumId, 'curriculumsILike': curriculumId }}),
            Users.updateMany({ dislikes: curriculumId }, { $pull: { 'dislikes': curriculumId } }),
            Matchs.deleteMany({ curriculum: curriculumId })])
        })
}
