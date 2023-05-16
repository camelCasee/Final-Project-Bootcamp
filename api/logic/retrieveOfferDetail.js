const { errors: { NotFoundError, ConflictError },
    validators: { stringValidator }
} = require('com')
const { Users, Offers } = require('../models')
/**
 * Retrieves one user offer
 * 
 * @param {string} userId The user id
 *  @param {string} offerId The offer id
 */
module.exports = function retrieveOfferToDetail(userId, offerId) {
    stringValidator(userId, 'userId')
    stringValidator(offerId, 'offerId')

    return Users.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)

            return Offers.findById(offerId).populate('user', 'name').select('-curriculumsIlike -curriculumsTheyLikeMe -__v').lean()
        })
        .then(offer => {
            if (!offer) throw new NotFoundError(`offer with id ${offerId} does not exist`)

            if(offer.languages){
            offer.languages.forEach(language=>{
                language.id = language._id.toString()
                delete language._id
            })
        }
            if(offer.experiences){
            offer.experiences.forEach(experience=>{
                experience.id = experience._id.toString()
                delete experience._id
            })
        }
            if(offer.studies){
            offer.studies.forEach(study=>{
                study.id = study._id.toString()
                delete study._id
            })
        }
            if(offer.knowledges) {
             offer.knowledges.forEach(knowledge=>{
                knowledge.id = knowledge._id.toString()
                delete knowledge._id
            })
        }
        if(offer.salary){
            offer.salary.id = offer.salary._id.toString()
            delete offer.salary._id
        }
            offer.id = offer._id.toString()
            offer.user.id = offer.user._id.toString()

            delete offer.user._id
            delete offer._id
            return offer
        })
}