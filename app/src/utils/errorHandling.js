import { errors } from 'com'
const { FormatError, AuthError, LengthError, NotFoundError, ConflictError, UnexpectedError, ContentError } = errors

function errorHandling(error) {
    if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError || ContentError)
        return { errorMessage: error.message, type: 'warn' }
    else if (error instanceof AuthError || error instanceof NotFoundError || error instanceof ConflictError)
        return { errorMessage: error.message, type: 'error' }
    else if (error instanceof UnexpectedError)
        return { errorMessage: error.message, type: 'fatal' }
    else
        return { errorMessage: error.message, type: 'fatal' }
}

export default errorHandling