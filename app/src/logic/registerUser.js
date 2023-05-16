import { errors, validators } from 'com'

const { FormatError, ConflictError, LengthError, UnexpectedError } = errors
const { nameValidator, emailValidator, passwordValidator, roleValidator } = validators

function registerUser(name, email, password, role) {
    emailValidator(email)
    passwordValidator(password)
    nameValidator(name)
    roleValidator(role)

    return fetch('http://localhost:80/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.status === 201) return
            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('valid') || error.error.includes('spaces')) throw new FormatError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })

            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error)
                    })
            } else if (res.status < 500) throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}
export default registerUser