import { useEffect, useContext } from 'react'
import deleteCurriculum from '../logic/deleteCurriculum'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function DeleteCurriculum({ className, curriculumToDelete, onDeleteCurriculum, onDeleteCurriculumClose }) {
    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const confirmDeleteCurriculum = () => {
        try {
            deleteCurriculum(sessionStorage.token, curriculumToDelete.id, curriculumToDelete.userId)
                .then(() => onDeleteCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeDeleteCurriculum = () => {
        onDeleteCurriculumClose()
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeDeleteCurriculum}>
        <div onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-5/6 h-fit bg-white border-2 p-5 rounded-xl ${className ? className : ""}`}>
            <p className='font-semibold text-lg'>Are you sure that you want to delete this curriculum?</p>
            <div className='flex justify-between gap-4 mt-5'>
                <Button className="text-md bg-emerald-200 w-1/2" onClick={closeDeleteCurriculum}>Cancel</Button>
                <Button className="text-md bg-red-400 w-1/2" onClick={confirmDeleteCurriculum}>Yes, Delete</Button>
            </div>
        </div>
    </div>
}

export default DeleteCurriculum