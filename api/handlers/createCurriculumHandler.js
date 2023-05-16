const createCurriculm = require('../logic/createCurriculum')

const { errors: { FormatError, LengthError, NotFoundError, ConflictError } } = require('com')

module.exports = (req, res) => {
    try {
        const { userId } = req

        createCurriculm(userId)
            .then(offerId => res.json(offerId))
            .catch(error => {
                if (error instanceof NotFoundError) res.status(404).json({ error: error.message })
                else if (error instanceof ConflictError) res.status(409).json({ error: error.message })
                else res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}