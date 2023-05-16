const { errors: { LengthError, NotFoundError, ConflictError, ContentError } } = require('com')
const searchOffers = require("../logic/searchOffers")

module.exports = (req, res) => {
    try {
        const { query: { q, location }, userId } = req

        searchOffers(userId, q, location)
            .then(offers => res.json(offers))
            .catch(error => {
                if (error instanceof NotFoundError)
                    res.status(404).json({ error: error.message })
                else if (error instanceof ConflictError)
                    res.status(409).json({ error: error.message })
                else
                    res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof LengthError || error instanceof ContentError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}
