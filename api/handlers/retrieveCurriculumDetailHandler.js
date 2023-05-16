const { errors: { LengthError, NotFoundError, ConflictError } } = require('com')
const retrieveCurriculumDetail = require('../logic/retrieveCurriculumDetail')

module.exports = (req, res) => {
    try {
        const { userId, params: { curriculumId } } = req

        retrieveCurriculumDetail(userId, curriculumId)
            .then(curriculum => res.json(curriculum))
            .catch(error => {
                if (error instanceof NotFoundError) res.status(404).json({ error: error.message })
                else if (error instanceof ConflictError) res.status(409).json({ error: error.message })
                else res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof LengthError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}