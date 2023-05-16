const { LengthError, FormatError } = require("../errors")

module.exports = function modalityValidator(modality){
    if (typeof modality !== 'string') throw new TypeError('modality is not a string')
    if (!modality.length) throw new LengthError('does not have length')
    if (modality !== 'remote' && modality !== 'face-to-face' && modality !== 'hybrid') throw new FormatError('invalid modality')
}