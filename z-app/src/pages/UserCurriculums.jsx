import { useEffect, useState, useContext } from "react"
import NavBar from "../components/NavBar"
import { format } from 'timeago.js'
import retrieveUserCurriculums from "../logic/retrieveUserCurriculums"
import DeleteCurriculum from "../components/DeleteCurriculum"
import { Link, useNavigate } from "react-router-dom"
import createCurriculum from "../logic/createCurriculum"
import Button from "../components/Button"
import PublishCurriculum from "../components/PublishCurriculum"
import { Context } from "../components/Context"
import errorHandling from "../utils/errorHandling"
import SearchButton from "../components/SearchButton"
import SearchPanel from "../components/SearchPanel"

function UserCurriculums() {
    const [curriculums, setCurriculums] = useState([])
    const [curriculumToDelete, setCurriculumToDelete] = useState()
    const [curriculumToPublish, setCurriculumToPublish] = useState()
    const [searchPanelStatus, setSearchPanelStatus] = useState()

    const { showAlert } = useContext(Context)

    const navigate = useNavigate()

    useEffect(() => {
        retrieveCurriculumHandler()
    }, [])

    const onDeleteCurriculum = () => {
        retrieveCurriculumHandler()
        setCurriculumToDelete()
    }

    const onDeleteCurriculumClose = () => setCurriculumToDelete()

    const onDeleteCurriculumClick = (id, userId) => setCurriculumToDelete({ id, userId })

    const onPublishCurriculum = () => {
        retrieveCurriculumHandler()
        setCurriculumToPublish()
    }

    const onPublishCurriculumClose = () => setCurriculumToPublish()

    const onPublishCurriculumClick = (id, userId, published) => setCurriculumToPublish({ id, userId, published })

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

    const onCreateCurriculumClick = () => {
        try {
            if (curriculums.length >= 3) throw new Error('Upgrade your account to premium to have more than 3 curriculums')

            createCurriculum(sessionStorage.token)
                .then(curriculumId => navigate(`/curriculums/${curriculumId}`))
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }
    
    const onSearchClick = () => {
        setSearchPanelStatus(true)
    }

    const closeSearchPanel = () => {
        setSearchPanelStatus()
    }

    return <main className="min-h-screen bg-slate-100">
            <SearchButton
            onSearchClick={onSearchClick}
            />
             {searchPanelStatus && <SearchPanel
            className={"inset-x-[2.5%] inset-y-[15%] absolute"} 
            closeSearchPanel={closeSearchPanel}
        />}
        <div className="flex items-center flex-col">
            <div className="w-full flex items-center flex-col mb-24">
                <div onClick={onCreateCurriculumClick} className="flex justify-center items-center font-semibold text-lg border-2 shadow-sm shadow-slate-600 w-5/6 h-20 z-10 rounded-xl bg-emerald-300 cursor-pointer">
                    <span className="ml-2">Create new Curriculum</span>
                </div>
                <section className="flex items-center flex-col w-5/6">
                    {curriculums.map(curriculum => {
                        return <article key={curriculum.id} className=" shadow-sm shadow-slate-600 bg-emerald-200 flex flex-col mt-3.5 border-2 p-4 w-full rounded-xl">
                            <Link to={`/curriculums/${curriculum.id}`} className="flex justify-between z-10">
                                <h2 className='font-semibold'>{curriculum.title}</h2>
                                <img className="w-1/5 text-xs" src={curriculum.photo} alt="worker perfil" />
                            </Link>
                            <p className="text-xs">{format(curriculum.createDate)}</p>
                            <hr className="w-full border-black mt-3.5" />
                            <div className='z-10 flex justify-between gap-4 mt-2'>
                                <Button className="text-md bg-red-400 w-1/2" onClick={() => onDeleteCurriculumClick(curriculum.id, curriculum.user.id)}>Delete</Button>
                                <Button className="text-md bg-green-400 w-1/2" onClick={() => onPublishCurriculumClick(curriculum.id, curriculum.user.id, curriculum.published)}>{curriculum.published ? 'Unpublish' : 'Publish'}</Button>
                            </div>
                        </article>
                    })}
                </section>
                {curriculumToDelete &&
                    <DeleteCurriculum
                        className="inset-x-[8.3%] inset-y-1/3 absolute"
                        curriculumToDelete={curriculumToDelete}
                        onDeleteCurriculum={onDeleteCurriculum}
                        onDeleteCurriculumClose={onDeleteCurriculumClose} />}
                {curriculumToPublish &&
                    <PublishCurriculum
                        className="inset-x-[5%] inset-y-1/3 absolute"
                        curriculumToPublish={curriculumToPublish}
                        onPublishCurriculum={onPublishCurriculum}
                        onPublishCurriculumClose={onPublishCurriculumClose} />}
            </div>
        </div>
        <NavBar
        />
    </main>
}

export default UserCurriculums