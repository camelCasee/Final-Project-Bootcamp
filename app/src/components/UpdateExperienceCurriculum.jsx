import { useState, useEffect, useContext } from 'react'
import updateCurriculum from '../logic/updateCurriculum'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateExperienceCurriculum({ className, onUpdateExperienceCurriculumClose, onUpdateExperienceCurriculum, curriculumExperienceData }) {
    const [experiences, setExperiences] = useState(curriculumExperienceData.experiences)

    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateExperienceCurriculumHandler = event => {
        event.preventDefault()

        let experiences = []

        if (event.target.position) {
            if (!event.target.position.value) {
                for (let i = 0; i < event.target.position.length; i++) {
                    const place = event.target.place[i].value
                    const position = event.target.position[i].value
                    const from = event.target.from[i].value
                    const to = event.target.to[i].value

                    experiences.push({ place, position, from, to })
                }
            } else {
                const { place: { value: place }, position: { value: position }, from: { value: from }, to: { value: to } } = event.target

                experiences.push({ place, position, from, to })
            }
        }
        try {
            updateCurriculum(sessionStorage.token, curriculumExperienceData.curriculumId, curriculumExperienceData.curriculumUserId, { experiences })
                .then(() => onUpdateExperienceCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })

        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeExperienceCurriculumHandler = () => {
        onUpdateExperienceCurriculumClose()
    }

    const handleNewExperience = () => {
        setExperiences(experiences => {
            const experiencesCopy = [...experiences]

            experiencesCopy.push({ idustry: "", position: "", years: "", id: Date.now() })

            return experiencesCopy
        })
    }

    const handleDeleteExperience = (id) => {
        setExperiences(experiences => {
            const experiencesCopy = [...experiences]

            const index = experiencesCopy.findIndex(experience => experience.id === id)

            experiencesCopy.splice(index, 1)

            return experiencesCopy
        })
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeExperienceCurriculumHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-4 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Experiences</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeExperienceCurriculumHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateExperienceCurriculumHandler} className="flex flex-col items-center w-full mt-2 gap-2">
                    <h3 className='font-semibold self-start'>Work Experiences: </h3>
                    {experiences?.map(experience => {
                        return <div key={experience.id} className="w-full self-start flex flex-col">
                            <div className='flex flex-col gap-1 p-1'>
                                <div className='flex gap-1'>
                                    <span className='font-semibold'>Place: </span>
                                    <textarea type="text" rows='1' name="place" id="place" autoFocus className="resize-none outline-none w-full" placeholder='Place' defaultValue={experience?.place}></textarea>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-semibold'>Position:</span>
                                    <textarea type="text" rows='1' name="position" id="position" className="resize-none outline-none w-full" placeholder='Position' defaultValue={experience?.position}></textarea>
                                </div>
                                <div className='flex'>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>From</span>
                                        <input name='from' id='from' className='text-lg p-1' type="date" defaultValue={experience?.from?.slice(0, -14)} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-semibold'>To</span>
                                        <input name='to' id='to' className='text-lg p-1' type="date" defaultValue={experience?.to?.slice(0, -14)} />
                                    </div>
                                </div>
                                <Button type="button" className="bg-red-300 mt-2" onClick={() => handleDeleteExperience(experience.id)}>Delete</Button>
                            </div>
                            <hr className="w-full" />
                        </div>
                    })}
                    <div className='flex justify-between gap-4 mt-5 w-full'>
                        <Button className="text-md bg-emerald-200 w-1/2" type="button" onClick={handleNewExperience}>New Experience</Button>
                        <Button className="text-md bg-green-400 w-1/2">Save Changes</Button>
                    </div>
                </form>
            </div>
        </article>
    </div>
}
export default UpdateExperienceCurriculum