import { useEffect, useState, useContext } from "react"
import NavBar from "../components/NavBar"
import { format } from 'timeago.js'
import { Link } from "react-router-dom"
import { Context } from "../components/Context"
import errorHandling from "../utils/errorHandling"
import SearchButton from "../components/SearchButton"
import SearchPanel from "../components/SearchPanel"
import retrieveMatchs from "../logic/retrieveMatchs"
import Button from "../components/Button"
import DislikeCurriculum from "../components/DislikeCurriculum"

function CompanyMatchs({ onOpenMatchs }) {
    const [matchs, setMatchs] = useState([])
    const [searchPanelStatus, setSearchPanelStatus] = useState()
    const [dislikeCurriculum, setDislikeCurriculum] = useState()
    const [curriculumIdToDislike, setCurriculumIdToDislike] = useState()

    const { showAlert } = useContext(Context)

    useEffect(() => {
        retrieveMatchsHandler()

        onOpenMatchs()
    }, [])

    const retrieveMatchsHandler = () => {
        try {
            retrieveMatchs(sessionStorage.token)
                .then(matchs => setMatchs(matchs))
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

    const dislikeCurriculumHandler = (offerId) => {
        setDislikeCurriculum(true)
        setCurriculumIdToDislike(offerId)

    }

    const onDislikeCurriculumClose = () => {
        setDislikeCurriculum()
    }

    const onDislikeCurriculum = () => {
        setDislikeCurriculum()
        setCurriculumIdToDislike()
        retrieveMatchsHandler()
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
                <div className="flex justify-center items-center font-semibold text-lg border-2 shadow-sm shadow-slate-600 w-5/6 h-20 z-10 rounded-xl bg-emerald-300 cursor-pointer">
                    <span className="ml-2">{matchs.length === 0 ? 'You dont have matchs yet' : 'My Matchs'}</span>
                </div>
                <section className="flex items-center flex-col w-5/6">
                    {matchs.map(match => {
                        return <article to={`/curriculums/${match.curriculum.id}`} key={match.curriculum.id} className="shadow-sm shadow-slate-600 bg-emerald-200 flex flex-col mt-3.5 border-2 p-2 w-full rounded-xl">
                            <div className="shadow-sm shadow-slate-600 bg-slate-100 flex flex-col border-2 p-4 w-full rounded-xl">
                                <span className="font-semibold text-xl self-center">{match.curriculum.user.name}</span>
                                <hr className="w-full border-black mt-3.5" />
                                <Link to={`/curriculums/${match.curriculum.id}`}>
                                    <div className="flex justify-between mt-2 z-10">
                                        <h2 className='font-semibold'>{match.curriculum.title}</h2>
                                        <img className="w-1/5 text-xs" src={match.curriculum.photo} alt="company logo" />
                                    </div>
                                    <p className="text-xs">{format(match.curriculum.createDate)}</p>
                                </Link>
                                <hr className="w-full border-black mt-3.5" />
                                <div className='z-10 flex justify-between gap-4 mt-2'>
                                    <Button onClick={() => dislikeCurriculumHandler(match.curriculum.id)} className="text-md bg-red-400 w-1/2">Dislike</Button>
                                    <Button className="text-md bg-green-400 w-1/2">Chat</Button>
                                </div>

                            </div>
                            <div className="flex gap-2 mt-1 ml-2">
                                <span>Offer liked:</span>
                                <span>{match.offer.title}</span>
                            </div>
                        </article>
                    })}
                </section>
            </div>
        </div>
        <NavBar
        />
        {dislikeCurriculum &&
            <DislikeCurriculum
                className="inset-x-[8.3%] inset-y-1/3 absolute"
                curriculumIdToDislike={curriculumIdToDislike}
                onDislikeCurriculum={onDislikeCurriculum}
                onDislikeCurriculumClose={onDislikeCurriculumClose} />}
    </main>
}

export default CompanyMatchs