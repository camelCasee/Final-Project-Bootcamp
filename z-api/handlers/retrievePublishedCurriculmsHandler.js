const retrievePublishedCurriculums = require('../logic/retrievePublishedCurriculums')
const { errors: { LengthError, NotFoundError, FormatError, ConflictError } } = require('com')

module.exports = (req, res) => {
    try {
        const { userId } = req

        retrievePublishedCurriculums(userId)
            .then(curriculums => res.json(curriculums))
            .catch(error => {
                if (error instanceof NotFoundError)
                    res.status(404).json({ error: error.message })
                else if (error instanceof ConflictError)
                    res.status(409).json({ error: error.message })
                else
                    res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof LengthError || error instanceof FormatError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}