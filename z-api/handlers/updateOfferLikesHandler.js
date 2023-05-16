const { errors: { LengthError, ConflictError, NotFoundError } } = require('com')
const updateOfferLikes = require('../logic/updateOfferLikes')

module.exports = (req, res) => {
    try {
        const { userId, params: { offerId, curriculumId } } = req

        updateOfferLikes(userId, offerId, curriculumId)
            .then(() => res.status(202).send())
            .catch(error => {
                if (error instanceof ConflictError) res.status(409).json({ error: error.message })
                else if (error instanceof NotFoundError) res.status(404).json({ error: error.message })
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