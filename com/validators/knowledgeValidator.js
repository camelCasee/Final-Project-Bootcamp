const { LengthError, FormatError } = require("../errors")

module.exports = function knowledgeValidator(knowledges){
    knowledges.forEach(knowledge =>{
        if(typeof knowledge.title !== 'string') throw new TypeError('title is not a string')
        if(!knowledge.title.length) throw new LengthError('title does not have length')

        if(typeof knowledge.level !== 'string') throw new TypeError('level is not a string')
        if(knowledge.level !== 'low' && knowledge.level !== 'medium' && knowledge.level !== 'high'&& knowledge.level !== 'master') 
        throw new FormatError('invalid level')
    })
}