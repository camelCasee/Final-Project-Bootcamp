import { errors, validators } from 'com'

const { LengthError, NotFoundError, UnexpectedError } = errors
const { stringValidator } = validators

function retrieveUser(token) {
    stringValidator(token, 'token')

    return fetch(`http://localhost:80/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 200) {
                return res.json()
                    .then(data => {
                        const user = data

                        return user
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

export default retrieveUser