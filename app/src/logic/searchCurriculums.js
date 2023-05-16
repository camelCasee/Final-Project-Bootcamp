import { validators, errors } from 'com'
const { UnexpectedError, ContentError, ConflictError } = errors
const { stringValidator } = validators

function searchCurriculums(token, keyWord, location) {
    stringValidator(token, 'token')
    if (keyWord) stringValidator(keyWord, 'key word')
    if (location) stringValidator(location, 'location')
    if (!keyWord && !location) throw new ContentError('introduce a field to search')

    const urlQuery = keyWord && location ? `q=${keyWord}&location=${location}`:
         keyWord ? `q=${keyWord}`: `location=${location}`


    return fetch(`http://localhost:80/search/curriculums?${urlQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json()
                    .then(curriculums => {
                        return curriculums
                    })
            }
            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        throw new TypeError(error.error)
                    })
            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error)
                    })
            } else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default searchCurriculums