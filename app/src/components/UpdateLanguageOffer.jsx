import { useState, useEffect, useContext } from 'react'
import updateOffer from '../logic/updateOffer'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateLanguageOffer({ className, onUpdateLanguageOfferClose, onUpdateLanguageOffer, offerLanguageData }) {
    const [languages, setLanguages] = useState(offerLanguageData.languages)

    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateLanguageOfferHandler = event => {
        event.preventDefault()

        let languages = []

        if (event.target.language) {
            if (!event.target.language.value) {
                for (let i = 0; i < event.target.language.length; i++) {
                    const language = event.target.language[i].value
                    const level = event.target.level[i].value

                    languages.push({ language, level })
                }
            } else {
                const { language: { value: language }, level: { value: level } } = event.target

                languages.push({ language, level })
            }
        }
        try {
            updateOffer(sessionStorage.token, offerLanguageData.offerId, offerLanguageData.offerUserId, { languages })
                .then(() => onUpdateLanguageOffer())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })

        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeLanguageOfferHandler = () => {
        onUpdateLanguageOfferClose()
    }

    const handleNewLanguage = () => {
        setLanguages(languages => {
            const languagesCopy = [...languages]

            languagesCopy.push({ language: "", level: "", id: Date.now() })

            return languagesCopy
        })
    }

    const handleDeleteLanguage = (id) => {
        setLanguages(languages => {
            const languagesCopy = [...languages]

            const index = languagesCopy.findIndex(language => language.id === id)

            languagesCopy.splice(index, 1)

            return languagesCopy
        })
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeLanguageOfferHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-4 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Languages</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeLanguageOfferHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateLanguageOfferHandler} className="flex flex-col items-center w-full mt-2 gap-2">
                    <h3 className='font-semibold self-start'>Languages:</h3>
                    <div className='w-full'>
                        {languages?.map(language => {
                            return <section key={language.id} className="flex self-start w-full">
                                <div className='flex w-full gap-6 p-1'>
                                    <select name="language" id="language" defaultValue={language.language ? language.language : 'select'}
                                        className="text-md w-3/6 block py-2.5 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                        <option disabled hidden value="select">Language</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="English">English</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Japanese">Japanese</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Portuguese">Portuguese</option>
                                    </select>
                                    <select name="level" id="level" defaultValue={language.level ? language.level : 'select'}
                                        className="text-md block py-2.5 w-2/6 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                        <option disabled hidden value="select">Level</option>
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                        <option value="C1">C1</option>
                                        <option value="C2">C2</option>
                                    </select>
                                    <Button type="button" className='bg-red-300' onClick={() => handleDeleteLanguage(language.id)}>Delete</Button>
                                </div>
                            </section>
                        })}
                    </div>
                    <div className='flex justify-between gap-4 mt-5 w-full'>
                        <Button className="text-md bg-emerald-200 w-1/2" type="button" onClick={handleNewLanguage}>New Language</Button>
                        <Button className="text-md bg-green-400 w-1/2">Save Changes</Button>
                    </div>
                </form>
            </div>
        </article>
    </div>
}
export default UpdateLanguageOffer