const { errors: { LengthError, NotFoundError } } = require('com')
const retrieveMatchsNotificationsAmount = require('../logic/retrieveMatchsNotificationsAmount')

module.exports = (req, res) => {
    try {
        const { userId } = req

        retrieveMatchsNotificationsAmount(userId)
            .then(result => res.status(202).json(result))
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