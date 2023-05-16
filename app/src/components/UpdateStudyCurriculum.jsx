import { useState, useEffect, useContext } from 'react'
import updateCurriculum from '../logic/updateCurriculum'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateStudyCurriculum({ className, onUpdateStudyCurriculumClose, onUpdateStudyCurriculum, curriculumStudyData }) {
    const [studies, setStudies] = useState(curriculumStudyData.studies)

    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateStudyCurriculumHandler = event => {
        event.preventDefault()

        let studies = []

        if (event.target.institution) {
            if (!event.target.institution.value) {
                for (let i = 0; i < event.target.institution.length; i++) {
                    const institution = event.target.institution[i].value
                    const title = event.target.title[i].value
                    const from = event.target.from[i].value
                    const to = event.target.to[i].value

                    studies.push({ institution, title, from, to })
                }
            } else {
                const { institution: { value: institution }, title: { value: title },
                    from: { value: from }, to: { value: to } } = event.target

                studies.push({ institution, title, from, to })
            }
        }
        try {
            updateCurriculum(sessionStorage.token, curriculumStudyData.curriculumId, curriculumStudyData.curriculumUserId, { studies })
                .then(() => onUpdateStudyCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })

        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeStudyCurriculumHandler = () => {
        onUpdateStudyCurriculumClose()
    }

    const handleNewStudy = () => {
        setStudies(studies => {
            const studiesCopy = [...studies]

            studiesCopy.push({ title: '', id: Date.now() })

            return studiesCopy
        })
    }

    const handleDeleteStudy = (id) => {
        setStudies(studies => {
            const studiesCopy = [...studies]

            const index = studiesCopy.findIndex(study => study.id === id)

            studiesCopy.splice(index, 1)

            return studiesCopy
        })
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeStudyCurriculumHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-4 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Studies</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeStudyCurriculumHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateStudyCurriculumHandler} className="flex flex-col items-center w-full mt-2 gap-1">
                    {studies?.map(study => {
                        return <div key={study.id} className="w-full self-start flex flex-col">
                            <div className='flex flex-col p-1 gap-1'>
                                <div className='flex gap-1'>
                                    <span className='font-semibold'>Institution: </span>
                                    <textarea type="text" rows='1' name="institution" id="institution" autoFocus className="resize-none outline-none w-full" placeholder='Institution' defaultValue={study?.institution}></textarea>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-semibold'>Title:</span>
                                    <textarea type="text" rows='1' name="title" id="title" className="resize-none outline-none w-full" placeholder='Title' defaultValue={study?.title}></textarea>
                                </div>
                                <div className='flex'>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>From</span>
                                        <input name='from' id='from' className='text-lg p-1' type="date" defaultValue={study?.from?.slice(0, -14)} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>To</span>
                                        <input name='to' id='to' className='text-lg p-1' type="date" defaultValue={study?.to?.slice(0, -14)}/>
                                    </div>
                                </div>
                                <Button type="button" className="bg-red-300 mt-2" onClick={() => handleDeleteStudy(study.id)}>Delete</Button>
                            </div>
                            <hr className="w-full" />
                        </div>
                    })}
                    <div className='flex justify-between gap-4 mt-5 w-full'>
                        <Button className="text-md bg-emerald-200 w-1/2" type="button" onClick={handleNewStudy}>New Study</Button>
                        <Button className="text-md bg-green-400 w-1/2">Save Changes</Button>
                    </div>
                </form>
            </div>
        </article>
    </div>
}
export default UpdateStudyCurriculum