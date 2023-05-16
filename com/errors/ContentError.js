module.exports = class ContentError extends Error {
    constructor(message) {
        super(message)

        this.name = ContentError.name
    }
}