const retrieveUserOffers = require('../logic/retrieveUserOffers')
const { errors: { LengthError, NotFoundError } } = require('com')

module.exports = (req, res) => {
    try {
        const { userId } = req

        retrieveUserOffers(userId)
            .then(offers => res.json(offers))
            .catch(error => {
                if (error instanceof NotFoundError)
                    res.status(404).json({ error: error.message })
                else
                    res.status(500).json({ error: error.message })
            })
    } catch (error) {
        if (error instanceof TypeError || error instanceof LengthError)
            res.status(400).json({ error: error.message })
        else
            res.status(500).json({ error: error.message })
    }
}