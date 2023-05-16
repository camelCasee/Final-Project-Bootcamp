const { errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Curriculums } = require('../models')
/**
 * Retrieves one user curriculum
 * 
 * @param {string} userId The user id
 *  @param {string} curriculumId The curriculum id
 */
module.exports = function retrieveCurriculumToDetail(userId, curriculumId) {
    stringValidator(userId, 'userId')
    stringValidator(curriculumId, 'curriculumId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Curriculums.findById(curriculumId).populate('user', 'name').select('-offersIlike -offersTheyLikeMe -__v').lean()
        })
        .then(curriculum => {
            if (!curriculum) throw new NotFoundError(`curriculum with id ${curriculumId} does not exist`)

            if(curriculum.languages){
            curriculum.languages.forEach(language=>{
                language.id = language._id.toString()
                delete language._id
            })
        }
            if(curriculum.experiences){
            curriculum.experiences.forEach(experience=>{
                experience.id = experience._id.toString()
                delete experience._id
            })
        }
            if(curriculum.studies){
            curriculum.studies.forEach(study=>{
                study.id = study._id.toString()
                delete study._id
            })
        }
            if(curriculum.knowledges) {
             curriculum.knowledges.forEach(knowledge=>{
                knowledge.id = knowledge._id.toString()
                delete knowledge._id
            })
        }
            curriculum.id = curriculum._id.toString()
            curriculum.user.id = curriculum.user._id.toString()

            delete curriculum.user._id
            delete curriculum._id
            return curriculum
        })
}