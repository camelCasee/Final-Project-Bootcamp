import { useEffect, useContext } from 'react'
import updateUserDislikes from '../logic/updateUserDislikes'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function DislikeCurriculum({ className, curriculumIdToDislike, onDislikeCurriculum, onDislikeCurriculumClose }) {
    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const confirmDislikeCurriculum = () => {
        try {
            updateUserDislikes(sessionStorage.token, curriculumIdToDislike)
                .then(() => onDislikeCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeDislikeCurriculum = () => {
        onDislikeCurriculumClose()
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeDislikeCurriculum}>
        <div onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-5/6 h-fit bg-white border-2 p-5 rounded-xl ${className ? className : ""}`}>
            <p className='font-semibold text-lg'>You want to Dislike this CV?</p>
            <div className='flex justify-between gap-4 mt-5'>
                <Button className="text-md bg-emerald-200 w-1/2" onClick={closeDislikeCurriculum}>Cancel</Button>
                <Button className="text-md bg-red-400 w-1/2" onClick={confirmDislikeCurriculum}>Yes</Button>
            </div>
        </div>
    </div>
}

export default DislikeCurriculum