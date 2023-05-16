import { useState, useEffect, useContext } from 'react'
import updateCurriculum from '../logic/updateCurriculum'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateKnowledgeCurriculum({ className, onUpdateKnowledgeCurriculumClose, onUpdateKnowledgeCurriculum, curriculumKnowledgeData }) {
    const { showAlert } = useContext(Context)

    const [knowledges, setKnowledges] = useState(curriculumKnowledgeData.knowledges)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateKnowledgeCurriculumHandler = event => {
        event.preventDefault()

        const knowledges = []

        if (event.target.title) {
            if (!event.target.title.value) {
                for (let i = 0; i < event.target.title.length; i++) {
                    const title = event.target.title[i].value
                    const level = event.target.level[i].value

                    knowledges.push({ title, level })
                }
            } else {
                const { title: { value: title }, level: { value: level } } = event.target

                knowledges.push({ title, level })
            }
        }
        try {
            updateCurriculum(sessionStorage.token, curriculumKnowledgeData.curriculumId, curriculumKnowledgeData.curriculumUserId, { knowledges })
                .then(() => onUpdateKnowledgeCurriculum())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeKnowledgeCurriculumHandler = () => {
        onUpdateKnowledgeCurriculumClose()
    }

    const handleNewKnowledge = () => {
        setKnowledges(knowledges => {
            const knowledgesCopy = [...knowledges]

            knowledgesCopy.push({ title: "", level: "", id: Date.now() })

            return knowledgesCopy
        })
    }

    const handleDeleteKnowledge = (id) => {
        setKnowledges(knowledges => {
            const knowledgesCopy = [...knowledges]

            const index = knowledgesCopy.findIndex(knowledge => knowledge.id === id)

            knowledgesCopy.splice(index, 1)

            return knowledgesCopy
        })
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeKnowledgeCurriculumHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-4 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Knowledges</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeKnowledgeCurriculumHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateKnowledgeCurriculumHandler} className="flex flex-col items-center w-full mt-2 gap-2">
                    <h3 className='font-semibold self-start'>Knowledges:</h3>
                    {knowledges?.map(knowledge => {
                        return <div key={knowledge.id} className="w-full self-start flex flex-col">
                            <div className='flex gap-1'>
                                <span className='font-semibold'>Skill:</span>
                                <input type="text" maxLength='25' autoFocus name="title" id="title" className="outline-none" placeholder='Skill' defaultValue={knowledge.title} />
                            </div>
                            <div className='flex justify-between'>
                                <select name="level" id="level" defaultValue={knowledge.level ? knowledge.level : 'select'}
                                    className="text-md block py-2.5 px-0 w-fit text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                    <option disabled hidden value="select">Level</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="master">Master</option>
                                </select>
                                <Button type="button" className="bg-red-300" onClick={() => handleDeleteKnowledge(knowledge.id)}>Delete</Button>
                            </div>
                            <hr className="w-full mt-3.5" />
                        </div>

                    })}
                    <div className='flex justify-between gap-4 mt-5 w-full'>
                        <Button className="text-md bg-emerald-200 w-1/2" type="button" onClick={handleNewKnowledge}>New Knowledge</Button>
                        <Button className="text-md bg-green-400 w-1/2">Save Changes</Button>
                    </div>

                </form>
            </div>
        </article>
    </div>
}
export default UpdateKnowledgeCurriculum