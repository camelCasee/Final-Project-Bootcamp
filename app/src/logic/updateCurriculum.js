import { errors, validators } from 'com'
import extractSubFromToken from '../utils/extractSubFromToken'

const { LengthError, NotFoundError, UnexpectedError, ConflictError, ContentError } = errors
const { stringValidator, languagesValidator, cvStudyValidator, cvExperienceValidator,
    knowledgeValidator, booleanValidator,
    titleValidator, descriptionValidator, locationValidator } = validators

function updateCurriculum(token, curriculumId, curriculumUserId, { title, description, photo, location, languages, studies, experiences, knowledges, published } = {}) {
    stringValidator(token, 'token')
    stringValidator(curriculumId, 'curriculumId')
    stringValidator(curriculumUserId, 'curriculumUserId')

    if (title) titleValidator(title)
    if (description) descriptionValidator(description, 'description')
    if (photo) stringValidator(photo, 'photo')
    if (location) locationValidator(location)
    if (languages) languagesValidator(languages)
    if (studies) cvStudyValidator(studies)
    if (experiences) cvExperienceValidator(experiences)
    if (knowledges) knowledgeValidator(knowledges)
    if (typeof published === 'boolean') booleanValidator(published, 'published')

    const userId = extractSubFromToken(token)

    if (curriculumUserId !== userId) throw new Error('userId is different than curriculumUserId')

    const body = {}

    if (title) body.title = title
    if (description || description === '') body.description = description
    if (photo) body.photo = photo
    if (location || location === '') body.location = location
    if (languages) body.languages = languages
    if (studies) body.studies = studies
    if (experiences) body.experiences = experiences
    if (knowledges) body.knowledges = knowledges
    if (typeof published === 'boolean') body.published = published

    return fetch(`http://localhost:80/curriculums/${curriculumId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 202) return

            else if (res.status === 400) {
                return res.json()
                    .then(error => {
                        if (error.error.includes('is not a')) throw new TypeError(error.error)
                        else if (error.error.includes('length')) throw new LengthError(error.error)
                    })
            } else if (res.status === 404) {
                return res.json()
                    .then(error => {
                        throw new NotFoundError(error.error)
                    })
            } else if (res.status === 406) {
                return res.json()
                    .then(error => {
                        throw new ContentError(error.error)
                    })
            } else if (res.status === 409) {
                return res.json()
                    .then(error => {
                        throw new ConflictError(error.error)
                    })
            } else if (res.status < 500)
                throw new UnexpectedError('client error')
            else
                throw new UnexpectedError('server error')
        })
}

export default updateCurriculum