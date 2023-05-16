import { useEffect, useContext } from 'react'
import updateCurriculum from '../logic/updateCurriculum'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function PublishCurriculum({ className, curriculumToPublish, onPublishCurriculum, onPublishCurriculumClose }) {
    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const isPublishedParraf = curriculumToPublish.published ? 'You want to unpublish this curriculum?' : 'You want to publish this curriculum?'

    const isPublishedButton = curriculumToPublish.published ? 'Yes, unpublish' : 'Yes, publish'

    const confirmPublishCurriculum = () => {
        try {
            const published = !curriculumToPublish.published

            updateCurriculum(sessionStorage.token, curriculumToPublish.id, curriculumToPublish.userId, { published })
                .then(() => onPublishCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    onPublishCurriculumClose()
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closePublishCurriculum = () => {
        onPublishCurriculumClose()
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closePublishCurriculum}>
        <div onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[90%] h-fit bg-white border-2 p-5 rounded-xl ${className ? className : ""}`}>
            <p className='font-semibold text-lg'>{isPublishedParraf}</p>
            <div className='flex justify-between gap-4 mt-5'>
                <Button className="text-md bg-emerald-200 w-1/2" onClick={closePublishCurriculum}>Cancel</Button>
                <Button className="text-md bg-green-400 w-1/2" onClick={confirmPublishCurriculum}>{isPublishedButton}</Button>
            </div>
        </div>
    </div>
}

export default PublishCurriculum