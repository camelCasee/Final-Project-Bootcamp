const updateCurriculum = require('../logic/updateCurriculum')

const { errors: { LengthError, ConflictError, NotFoundError, ContentError } } = require('com')

module.exports = (req, res) => {
    try {
        const { userId, params: { curriculumId }, body: { title, description, photo, location, languages, studies, experiences, knowledges, published } } = req

        updateCurriculum(userId, curriculumId, title, description, photo, location, languages, studies, experiences, knowledges, published)
            .then(() => res.status(202).send())
            .catch(error => {
                if (error instanceof ConflictError) res.status(409).json({ error: error.message })
                else if (error instanceof NotFoundError) res.status(404).json({ error: error.message })
                else if (error instanceof ContentError) res.status(406).json({ error: error.message })
                else res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof LengthError)
            res.status(400).json({ error: error.message })
        else if (error instanceof ConflictError)
            res.status(409).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}