import { useContext, useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { Context } from "../components/Context"
import searchCurriculums from "../logic/searchCurriculums"
import { format } from 'timeago.js'
import Button from "../components/Button"
import errorHandling from "../utils/errorHandling"
import SearchButton from "../components/SearchButton"
import SearchPanel from "../components/SearchPanel"
import { useSearchParams } from 'react-router-dom'
import OffersToChoose from "../components/OffersToChoose"
import DislikeCurriculum from "../components/DislikeCurriculum"

function SearchedCurriculums() {
    const [curriculums, setCurriculums] = useState([])
    const [searchPanelStatus, setSearchPanelStatus] = useState()
    const [searchParams, setSearchParams] = useSearchParams()
    const [chooseOffer, setChooseOffer] = useState()
    const [curriculumIdILike, setCurriculumIdILike] = useState()
    const [dislikeCurriculum, setDislikeCurriculum] = useState()
    const [curriculumIdToDislike, setCurriculumIdToDislike] = useState()

    const { user, showAlert } = useContext(Context)

    useEffect(() => {
        retrieveSearchedCurriculums()
    }, [searchParams.get('q'), searchParams.get('location')])

    const retrieveSearchedCurriculums = () => {
        try {
            const keyWord = searchParams.get('q')
            const location = searchParams.get('location')
            searchCurriculums(sessionStorage.token, keyWord, location)
                .then(curriculums => {
                    setCurriculums(curriculums)
                    setSearchPanelStatus()
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

    const onSearchClick = () => {
        setSearchPanelStatus(true)
    }

    const closeSearchPanel = () => {
        setSearchPanelStatus()
    }

    const likeCurriculumHandler = curriculumId => {
        setChooseOffer(true)
        setCurriculumIdILike(curriculumId)
    }

    const onChooseOfferClose = () => {
        setChooseOffer()
    }

    const onChooseOffer = () => {
        setChooseOffer()
        setCurriculumIdILike()
        retrieveSearchedCurriculums()
    }

    const dislikeCurriculumHandler = curriculumId => {
        setDislikeCurriculum(true)
        setCurriculumIdToDislike(curriculumId)
    }

    const onDislikeCurriculumClose = () => {
        setDislikeCurriculum()
    }

    const onDislikeCurriculum = () => {
        setDislikeCurriculum()
        setCurriculumIdToDislike()
        retrieveSearchedCurriculums()
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
            <div className="flex items-center flex-col w-full mb-16">
                <section className="flex items-center w-full flex-col pt-2 px-2">
                    {curriculums?.length ? curriculums.map(curriculum => {
                        return <article key={curriculum.id} className="flex flex-col gap-2 pt-4 shadow-sm shadow-slate-600 bg-emerald-200 border-2 w-full rounded-xl">
                            <div className="w-full flex justify-center">
                                <span className="font-semibold text-lg">{curriculum.user.name}</span>
                            </div>
                            <div className="flex justify-between z-10 p-2 mt-1">
                                <h2 className='bg-emerald-200 w-3/4 p-4 border-2 font-semibold resize-none outline-none rounded-lg'>{curriculum.title}</h2>
                                <img className="w-1/4 text-xs p-2" src={curriculum.photo} alt="company logo" />
                            </div>
                            <div className='overflow-scroll h-[32rem] flex flex-col gap-2 bg-white p-2'>
                                <div className=' rounded-lg bg-emerald-50 p-2'>
                                    <div className='flex gap-6 justify-between'>
                                    </div>
                                    <div className='flex gap-1'>
                                        <span className="font-semibold">Location:</span>
                                        <span className="text-md w-1/2 text-gray-700 bg-transparent border-0 border-gray-200 capitalize">{curriculum?.location ? curriculum.location : 'Location'}</span>
                                    </div>
                                </div>
                                <div className='bg-slate-100 p-2 rounded-lg'>
                                    <h3 className='font-semibold'>Description:</h3>
                                    <p className='ml-1'>{curriculum?.description}</p>

                                </div>
                                <div className="rounded-lg bg-emerald-50 p-2">
                                    <h2 className='font-semibold'>Experiences:</h2>
                                    {!curriculum.experiences?.length ? <span>Not Experiences</span> :
                                        curriculum.experiences.map(experience => {
                                            return <div key={experience.id}>
                                                <h3>Position: {experience.position}</h3>
                                                <span>{experience.years} years of experience</span>
                                            </div>
                                        })}
                                </div>
                                <div>
                                    <div className="rounded-lg bg-slate-100 p-2">
                                        <h2 className='font-semibold'>Studies:</h2>
                                        {!curriculum.studies?.length ? <span>Not Studies</span> :
                                            curriculum.studies.map(study => {
                                                return <div key={study.id}>
                                                    <h3>{study.title}</h3>
                                                </div>
                                            })}
                                    </div>
                                </div>
                                <div className=" rounded-lg bg-emerald-50 p-2">
                                    <h2 className='font-semibold'>Knowledges:</h2>
                                    {!curriculum?.knowledges?.length ? <span> Not Knowledges </span> :
                                        <ul className="flex flex-wrap gap-2">
                                            {curriculum?.knowledges.map(knowledge => {
                                                return <li key={knowledge.id} className="max-w-[45%] text-sm flex border flex-col gap-1 rounded-xl p-1">
                                                    <span>{knowledge.title}</span>
                                                    <span>Level: <span className='capitalize'>{knowledge.level}</span></span>
                                                </li>
                                            })}
                                        </ul>
                                    }
                                </div>
                                <div className="rounded-lg bg-slate-100 p-2">
                                    <h2 className='font-semibold'>Languages:</h2>
                                    {!curriculum.languages?.length ? <span>Not Languages</span> :
                                        <div className="flex flex-wrap">
                                            {curriculum.languages.map(language => {
                                                return <div key={language.id} className="flex flex-col w-1/2">
                                                    <div>
                                                        <span>{language.language}: </span>
                                                        <span>{language.level}</span>
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='z-10 flex justify-between gap-2 p-1 mb-2'>
                                <Button onClick={() => dislikeCurriculumHandler(curriculum.id)} className="text-lg font-semibold h-20 bg-red-400 w-1/3">Dislike</Button>
                                <p className="self-end text-sm p-1">{format(curriculum.createDate)}</p>
                                <Button onClick={() => likeCurriculumHandler(curriculum.id)} className="text-lg font-semibold h-20 bg-green-400 w-1/3">Like</Button>
                            </div>
                        </article>
                    }) : <div>
                        <h3>No results</h3>
                    </div>
                    }
                </section>
            </div>
        </div>
        <NavBar
        />
        {chooseOffer &&
            <OffersToChoose
                className="inset-x-[8.3%] top-[5%] absolute"
                curriculumIdILike={curriculumIdILike}
                onChooseOffer={onChooseOffer}
                onChooseOfferClose={onChooseOfferClose} />}
        {dislikeCurriculum &&
            <DislikeCurriculum
                className="inset-x-[8.3%] inset-y-1/3 absolute"
                curriculumIdToDislike={curriculumIdToDislike}
                onDislikeCurriculum={onDislikeCurriculum}
                onDislikeCurriculumClose={onDislikeCurriculumClose} />}

    </main>
}

export default SearchedCurriculums