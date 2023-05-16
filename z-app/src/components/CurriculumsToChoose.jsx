import { useEffect, useState, useContext } from "react"
import { format } from 'timeago.js'
import retrieveUserCurriculums from "../logic/retrieveUserCurriculums"
import Button from "./Button"
import { Context } from "./Context"
import errorHandling from "../utils/errorHandling"
import updateCurriculumLikes from "../logic/updateCurriculumLikes"

function CurriculumsToChoose({ className, offerIdILike, onChooseCurriculumClose, onChooseCurriculum }) {
    const [curriculums, setCurriculums] = useState([])

    const { showAlert } = useContext(Context)

    useEffect(() => {
        retrieveCurriculumHandler()
    }, [])


    const retrieveCurriculumHandler = () => {
        try {
            retrieveUserCurriculums(sessionStorage.token)
                .then(curriculums => setCurriculums(curriculums))
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const onCurriculumClick = (curriculumId, curriculumUserId) => {
        try {
            updateCurriculumLikes(sessionStorage.token, curriculumId, offerIdILike, curriculumUserId)
                .then(() => {
                    onChooseCurriculum()
                })
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={() => onChooseCurriculumClose()}>
        <div onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-5/6 h-fit bg-white border-2 p-5 rounded-xl ${className ? className : ""}`}>
            <div className="flex items-center flex-col">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-semibold text-lg w-fit col-start-2 col-end-11">Choose a Cv to postulate</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={() => onChooseCurriculumClose()}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <div className="w-full flex items-center flex-col">
                    <section className="flex items-center flex-col w-5/6">
                        {curriculums.map(curriculum => {
                            return <article key={curriculum.id} className=" shadow-sm shadow-slate-600 bg-emerald-200 flex flex-col mt-3.5 border-2 p-4 w-full rounded-xl">
                                <div className="flex justify-between z-10">
                                    <h2 className='font-semibold'>{curriculum.title}</h2>
                                    <img className="w-1/5 text-xs" src={curriculum.photo} alt="worker perfil" />
                                </div>
                                <p className="text-xs">{format(curriculum.createDate)}</p>
                                <hr className="w-full border-black mt-3.5" />
                                <div className='z-10 flex justify-end gap-4 mt-2'>
                                    <Button className="text-md bg-green-400 w-1/2" onClick={() => onCurriculumClick(curriculum.id, curriculum.user.id)}>Use</Button>
                                </div>
                            </article>
                        })}
                    </section>
                </div>
            </div>
        </div>
    </div>
}

export default CurriculumsToChoose