import { useState, useEffect, useContext } from 'react'
import NavBar from '../components/NavBar'
import { format } from 'timeago.js'
import { useParams, Link } from "react-router-dom"
import retrieveCurriculumDetail from '../logic/retrieveCurriculumDetail'
import { Context } from "../components/Context"
import updateCurriculum from '../logic/updateCurriculum'
import UpdateLanguageCurriculum from '../components/UpdateLanguageCurriculum'
import UpdateExperienceCurriculum from '../components/UpdateExperienceCurriculum'
import UpdateStudyCurriculum from '../components/UpdateStudyCurriculum'
import UpdateKnowledgeCurriculum from '../components/UpdateKnowledgeCurriculum'
import Button from '../components/Button'
import errorHandling from '../utils/errorHandling'
import SearchButton from '../components/SearchButton'
import SearchPanel from '../components/SearchPanel'

function CurriculumDetail() {
    const [curriculum, setCurriculum] = useState()
    const [updatingLanguage, setUpdatingLanguage] = useState()
    const [updatingExperience, setUpdatingExperience] = useState()
    const [updatingStudy, setUpdatingStudy] = useState()
    const [updatingKnowledge, setUpdatingKnowledge] = useState()
    const [searchPanelStatus, setSearchPanelStatus] = useState()

    const { user, showAlert } = useContext(Context)
    const { curriculumId } = useParams()

    useEffect(() => {
        if (user) {
            retrieveCurriculum()
        }
    }, [user])

    const retrieveCurriculum = () => {
        try {
            retrieveCurriculumDetail(sessionStorage.token, curriculumId)
                .then(curriculumDetail => setCurriculum(curriculumDetail))
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)

                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)

            showAlert(errorMessage, type)
        }
    }

    let titleTimeoutId

    const updateCurriculumTitle = (event, curriculumUserId) => {
        const { target: { value: title } } = event

        if (titleTimeoutId) clearTimeout(titleTimeoutId)

        try {
            titleTimeoutId = setTimeout(() => {
                updateCurriculum(sessionStorage.token, curriculumId, curriculumUserId, { title })
                    .catch(error => {
                        const { errorMessage, type } = errorHandling(error)
                        showAlert(errorMessage, type)
                    })
            }, 500)
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    let descriptionTimeoutId

    const updateCurriculumDescription = (event, curriculumUserId) => {
        const { target: { value: description } } = event

        if (descriptionTimeoutId) clearTimeout(descriptionTimeoutId)

        try {
            descriptionTimeoutId = setTimeout(() => {
                updateCurriculum(sessionStorage.token, curriculumId, curriculumUserId, { description })
                    .catch(error => {
                        const { errorMessage, type } = errorHandling(error)
                        showAlert(errorMessage, type)
                    })
            }, 500)
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    let locationTimeoutId

    const updateCurriculumLocation = (event, curriculumUserId) => {
        const { target: { value: location } } = event

        if (locationTimeoutId) clearTimeout(locationTimeoutId)

        try {
            locationTimeoutId = setTimeout(() => {
                updateCurriculum(sessionStorage.token, curriculumId, curriculumUserId, { location })
                    .catch(error => {
                        const { errorMessage, type } = errorHandling(error)
                        showAlert(errorMessage, type)
                    })
            }, 500)
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const onLanguageClick = (curriculumUserId, languages) => {
        setUpdatingLanguage({ curriculumId, curriculumUserId, languages })
    }

    const onUpdateLanguageCurriculum = () => {
        setUpdatingLanguage()
        retrieveCurriculum()
    }

    const onUpdateLanguageCurriculumClose = () => {
        setUpdatingLanguage()
    }

    const onExperienceClick = (curriculumUserId, experiences) => {
        setUpdatingExperience({ curriculumId, curriculumUserId, experiences })
    }

    const onUpdateExperienceCurriculum = () => {
        setUpdatingExperience()
        retrieveCurriculum()
    }

    const onUpdateExperienceCurriculumClose = () => {
        setUpdatingExperience()
    }

    const onStudyClick = (curriculumUserId, studies) => {
        setUpdatingStudy({ curriculumId, curriculumUserId, studies })
    }

    const onUpdateStudyCurriculum = () => {
        setUpdatingStudy()
        retrieveCurriculum()
    }

    const onUpdateStudyCurriculumClose = () => {
        setUpdatingStudy()
    }

    const onKnowledgeClick = (curriculumUserId, knowledges) => {
        setUpdatingKnowledge({ curriculumId, curriculumUserId, knowledges })
    }

    const onUpdateKnowledgeCurriculum = () => {
        setUpdatingKnowledge()
        retrieveCurriculum()
    }

    const onUpdateKnowledgeCurriculumClose = () => {
        setUpdatingKnowledge()
    }

    const onSearchClick = () => {
        setSearchPanelStatus(true)
    }

    const closeSearchPanel = () => {
        setSearchPanelStatus()
    }

    return <>{curriculum && <main className="min-h-screen bg-slate-100">
        <SearchButton
            onSearchClick={onSearchClick}
        />
        {searchPanelStatus && <SearchPanel
            className={"inset-x-[2.5%] inset-y-[15%] absolute"}
            closeSearchPanel={closeSearchPanel}
        />}
        <div className="flex items-center flex-col">
            <div className="flex items-center flex-col w-full mb-16">
                <section className="flex items-center flex-col w-full p-2">
                    <article className="flex flex-col pt-4 gap-2 shadow-sm shadow-slate-600 bg-emerald-200 border-2 w-full rounded-xl">
                        <div className="w-full flex justify-center">
                            <span className="font-semibold text-lg">{curriculum.user.name}</span>
                        </div>
                        <div className="flex justify-between gap-5 z-10 p-2 mt-1">
                            {curriculum?.published || user.role !== 'worker' ?
                                <h2 className='bg-emerald-200 w-3/4 p-4 border-2 font-semibold resize-none outline-none rounded-lg'>{curriculum.title}</h2> :
                                <textarea onChange={event => updateCurriculumTitle(event, curriculum.user.id)} name='title' maxLength="25" id='title' rows='1' className='bg-emerald-200 p-4 w-3/4 border-2 font-semibold resize-none outline-none rounded-lg' defaultValue={curriculum?.title}></textarea>
                            }
                            <img className="w-1/4 text-xs p-2" src={curriculum?.photo} alt="worker perfil" />
                        </div>
                        <div className='overflow-scroll h-[32rem] flex flex-col gap-2 bg-white p-2'>
                            <div className=' rounded-lg bg-emerald-50 p-2'>
                                <div className='flex gap-6 justify-between'>
                                </div>
                                <div className='flex gap-6 mt-2'>
                                    <h2 className='font-semibold'>Location:</h2>
                                    {curriculum?.published || user.role !== 'worker' ?
                                        <span className="text-md w-1/2 block py-2.5 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 capitalize">{curriculum?.location ? curriculum.location : 'Location'}</span> :
                                        <input onChange={event => updateCurriculumLocation(event, curriculum.user.id)} defaultValue={curriculum?.location} type="text" placeholder='Location' className='w-2/3 outline-none rounded-md bg-emerald-50' />
                                    }
                                </div>
                            </div>
                            <div className='bg-slate-100 p-2 rounded-lg'>
                                <h3 className='font-semibold'>Description:</h3>
                                {curriculum?.published || user.role !== 'worker' ?
                                    <p name='description' id='description' className='ml-1'>{curriculum?.description}</p> :
                                    <textarea onChange={event => updateCurriculumDescription(event, curriculum.user.id)} maxLength="140" rows='3' name='description' id='description' className='w-full resize-none outline-none bg-slate-100 rounded-lg' placeholder='Put a description' defaultValue={curriculum?.description}></textarea>
                                }
                            </div>
                            <div onClick={() => { return curriculum.published || user.role !== 'worker' ? null : onExperienceClick(curriculum.user.id, curriculum.experiences) }} className="cursor-pointer rounded-lg bg-emerald-50 p-2">
                                <h2 className='font-semibold'>Experiences: </h2>
                                {!curriculum?.experiences.length && <span> Not Experiences</span>}
                                <div className='flex flex-col gap-2'>
                                    {curriculum?.experiences.map(experience => {
                                        return <div key={experience.id} className='flex flex-col'>
                                            <div className='flex gap-1'>
                                                <h3 className='font-semibold'>Place:</h3>
                                                <span>{experience.place}</span>
                                            </div>
                                            <div className='flex gap-1'>
                                                <h3 className='font-semibold'>Position:</h3>
                                                <span>{experience.position}</span>
                                            </div>
                                            <div className='flex gap-1'>
                                                <h3 className='font-semibold'>From:</h3>
                                                <span>{experience.from?.slice(0, -14).split("-").reverse().join("-")}</span>
                                            </div>
                                            <div className='flex gap-1'>
                                                <h3 className='font-semibold'>To:</h3>
                                                <span>{experience.to?.slice(0, -14).split("-").reverse().join("-")}</span>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div>
                                <div onClick={() => { return curriculum.published || user.role !== 'worker' ? null : onStudyClick(curriculum.user.id, curriculum.studies) }} className="cursor-pointer rounded-lg bg-slate-100 p-2">
                                    <h2 className='font-semibold'>Studies:</h2>
                                    {!curriculum?.studies?.length ? <span>Not Studies</span> :
                                        curriculum?.studies.map(study => {
                                            return <div key={study.id} className='flex flex-col'>
                                                <div className='flex gap-1'>
                                                    <h3 className='font-semibold'>Institution:</h3>
                                                    <span>{study.institution}</span>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <h3 className='font-semibold'>Title:</h3>
                                                    <span>{study.title}</span>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <h3 className='font-semibold'>From:</h3>
                                                    <span>{study.from?.slice(0, -14).split("-").reverse().join("-")}</span>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <h3 className='font-semibold'>To:</h3>
                                                    <span>{study.to?.slice(0, -14).split("-").reverse().join("-")}</span>
                                                </div>
                                            </div>
                                        })}
                                </div>
                            </div>
                            <div onClick={() => { return curriculum.published || user.role !== 'worker' ? null : onKnowledgeClick(curriculum.user.id, curriculum.knowledges) }} className="cursor-pointer rounded-lg bg-emerald-50 p-2">
                                <h2 className='font-semibold'>Knowledges:</h2>
                                {!curriculum?.knowledges?.length ? <span> Not Knowledges</span> :
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
                            <div onClick={() => { return curriculum.published || user.role !== 'worker' ? null : onLanguageClick(curriculum.user.id, curriculum.languages) }} className="cursor-pointer rounded-lg bg-slate-100 p-2">
                                <h2 className='font-semibold'>Languages:</h2>
                                {!curriculum?.languages?.length ? <span>Not Languages</span> :
                                    <div className="flex flex-wrap">
                                        {curriculum?.languages.map(language => {
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
                        <div className='w-full z-10 flex justify-between p-2'>
                            {user?.role === 'worker' && <Link to='/user/profile' className='w-1/3'><Button className='h-20 bg-emerald-300 w-full'>Go Back</Button></Link>}
                            {user?.role === 'company' && <Link to='/company/matchs' className='w-1/3'><Button className='h-20 bg-emerald-300 w-full'>Go Back</Button></Link>}
                            <p className="self-end p-2">{format(curriculum?.createDate)}</p>
                        </div>
                    </article>
                </section>
                {updatingExperience &&
                    <UpdateExperienceCurriculum
                        className={"inset-x-[2.5%] inset-y-[15%] absolute"}
                        onUpdateExperienceCurriculumClose={onUpdateExperienceCurriculumClose}
                        curriculumExperienceData={updatingExperience}
                        onUpdateExperienceCurriculum={onUpdateExperienceCurriculum}
                    />
                }
                {updatingLanguage &&
                    <UpdateLanguageCurriculum
                        className={"inset-x-[2.5%] inset-y-[15%] absolute"}
                        onUpdateLanguageCurriculumClose={onUpdateLanguageCurriculumClose}
                        curriculumLanguageData={updatingLanguage}
                        onUpdateLanguageCurriculum={onUpdateLanguageCurriculum}
                    />
                }
                {updatingStudy &&
                    <UpdateStudyCurriculum
                        className={"inset-x-[2.5%] inset-y-[15%] absolute"}
                        onUpdateStudyCurriculumClose={onUpdateStudyCurriculumClose}
                        curriculumStudyData={updatingStudy}
                        onUpdateStudyCurriculum={onUpdateStudyCurriculum}
                    />
                }
                {updatingKnowledge &&
                    <UpdateKnowledgeCurriculum
                        className={"inset-x-[2.5%] inset-y-[15%] absolute"}
                        onUpdateKnowledgeCurriculumClose={onUpdateKnowledgeCurriculumClose}
                        curriculumKnowledgeData={updatingKnowledge}
                        onUpdateKnowledgeCurriculum={onUpdateKnowledgeCurriculum}
                    />
                }
            </div>
        </div>
        <NavBar
        />
    </main >
    }</>
}
export default CurriculumDetail