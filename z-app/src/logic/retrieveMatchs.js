import { errors, validators } from 'com'

const { LengthError, NotFoundError, UnexpectedError } = errors
const { stringValidator } = validators

function retrieveMatchs(token) {
    stringValidator(token, 'token')
    
    return fetch(`http://localhost:80/matchs`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    })
        .then(res => {
            if (res.status === 202) {
                return res.json()
                    .then(matchs => {
                        return matchs
                    })
            }
            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })
            } else if (res.status === 404) {
                return res.json()
                    .then(error => {
                        throw new NotFoundError(error.error)
                    })
            }
            else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default retrieveMatchs