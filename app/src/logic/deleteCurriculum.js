import extractSubFromToken from '../utils/extractSubFromToken'

import { errors, validators } from 'com'

const { FormatError, ConflictError, LengthError, UnexpectedError, NotFoundError } = errors
const { stringValidator } = validators


function deleteCurriculum( token, curriculumId, curriculumUserId) {
    stringValidator(token, 'token')
    stringValidator(curriculumId, 'curriculumId')
    stringValidator(curriculumUserId, 'curriculumUserId')

    const userId = extractSubFromToken(token)

    if (curriculumUserId !== userId) throw new Error('userId is different than curriculumUserId')

    return fetch(`http://localhost:80/curriculums/${curriculumId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 202) return
            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('valid') || error.error.includes('spaces')) throw new FormatError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })
            } else if (res.status === 404) {
                return res.json()
                    .then(error => {
                        throw new NotFoundError(error.error)
                    })
            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error.message)
                    })
            } else if (res.status < 500) throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default deleteCurriculum