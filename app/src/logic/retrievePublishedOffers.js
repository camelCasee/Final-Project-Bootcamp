import { errors, validators } from 'com'

const { LengthError, NotFoundError, UnexpectedError, ConflictError } = errors
const { stringValidator } = validators

function retrievePublishedOffers(token) {
    stringValidator(token, 'token')
    
    return fetch(`http://localhost:80/offers`, {
        method: 'GET',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json()
                    .then(offers => {
                        return offers
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
            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error)
                    })
            }
            else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default retrievePublishedOffers