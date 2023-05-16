const { errors: { LengthError, NotFoundError, ConflictError } } = require('com')
const retrieveOfferDetail = require('../logic/retrieveOfferDetail')

module.exports = (req, res) => {
    try {
        const { userId, params: { offerId } } = req

        retrieveOfferDetail(userId, offerId)
            .then(offer => res.json(offer))
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