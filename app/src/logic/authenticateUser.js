import { errors, validators } from 'com'

const { FormatError, AuthError, LengthError, NotFoundError, UnexpectedError } = errors
const { emailValidator, passwordValidator } = validators

/**
 * Authenticates a user
 * 
 * @param {string} email The user email
 * @param {string} password The user password
 */

function authenticateUser(email, password) {
    emailValidator(email)
    passwordValidator(password)

    return fetch('http://localhost:80/users/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.status === 200)  {
                return res.json()
                .then(data => {
                    const { token } = data
        
                    return token
                })
            }

            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('valid') || error.error.includes('spaces')) throw new FormatError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })

            } else if (res.status === 401) {
                return res.json()
                    .then(error => {
                        throw new AuthError(error.error)
                    })

            } else if (res.status === 404) {
                return res.json()
                .then(error =>{
                    throw new NotFoundError(error.error)
                })
            } else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')

        })
}

export default authenticateUser
