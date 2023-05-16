import { useState, useEffect, useContext } from 'react'
import updateOffer from '../logic/updateOffer'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateExperienceOffer({ className, onUpdateExperienceOfferClose, onUpdateExperienceOffer, offerExperienceData }) {
    const [experiences, setExperiences] = useState(offerExperienceData.experiences)

    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateExperienceOfferHandler = event => {
        event.preventDefault()

        let experiences = []

        if (event.target.position) {
            if (!event.target.position.value) {
                for (let i = 0; i < event.target.position.length; i++) {
                    const position = event.target.position[i].value
                    const years = event.target.years[i].value

                    experiences.push({ position, years })
                }
            } else {
                const { position: { value: position }, years: { value: years } } = event.target

                experiences.push({ position, years })
            }
        }
        try {
            updateOffer(sessionStorage.token, offerExperienceData.offerId, offerExperienceData.offerUserId, { experiences })
                .then(() => onUpdateExperienceOffer())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })

        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeExperienceOfferHandler = () => {
        onUpdateExperienceOfferClose()
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

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeExperienceOfferHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-4 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Experiences</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeExperienceOfferHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateExperienceOfferHandler} className="flex flex-col items-center w-full mt-2 gap-2">
                    {experiences?.map(experience => {
                        return <div key={experience.id} className="w-full self-start flex">
                            <div className='flex flex-col'>
                            <div>
                                <label htmlFor="position" className="self-start font-semibold">Position: </label>
                                <input maxLength='20' type="text" autoFocus name="position" id="position" className="outline-none w-2/3" placeholder='Position' defaultValue={experience.position} />
                            </div>
                                <div>
                                    <label htmlFor="years" className="self-start h-full font-semibold">Years: </label>
                                    <input maxLength='2' type="text" name="years" id="years" className="outline-none w-1/4" placeholder='Years' defaultValue={experience.years} />
                                </div>
                            </div>
                            <Button type="button" className="bg-red-300 h-1/2 self-end" onClick={() => handleDeleteExperience(experience.id)}>Delete</Button>
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
export default UpdateExperienceOffer
                            /* <div>
    <h3>Industry:</h3>
    <select name="industry" id="industry" className='text-sm block py-2.5 px-0 w-full text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
        defaultValue={experience.industry ? experience.industry : 'select'}>
        <option disabled hidden value="select">Choose an industry</option>
        <option value="Agriculture; plantations; other rural sectors">Agriculture; plantations; other rural sectors</option>
        <option value="Basic metal production">Basic metal production</option>
        <option value="Chemical industries">Chemical industries</option>
        <option value="Commerce">Commerce</option>
        <option value="Construction">Construction</option>
        <option value="Education">Education</option>
        <option value="Financial services">Financial services; professional services</option>
        <option value="Food; drink; tobacco">Food; drink; tobacco</option>
        <option value="Forestry; wood; pulp and paper">Forestry; wood; pulp and paper</option>
        <option value="Health Services">Health Services</option>
        <option value="Hotels; tourism; catering">Hotels; tourism; catering</option>
        <option value="Mining">Mining</option>
        <option value="Mechanical and electrical engineering">Mechanical and electrical engineering</option>
        <option value="Media; culture; graphical">Media; culture; graphical</option>
        <option value="Oil and gas production; oil refining">Oil and gas production; oil refining</option>
        <option value="Postal and telecommunications services">Postal and telecommunications services</option>
        <option value="Public service">Public service</option>
        <option value="Shipping; ports; fisheries; inland waterways">Shipping; ports; fisheries; inland waterways</option>
        <option value="Textiles; clothing; leather; footwear">Textiles; clothing; leather; footwear</option>
        <option value="Transport (including civil aviation; railways; road transport)">Transport (including civil aviation; railways; road transport)</option>
        <option value="Transport equipment manufacturing">Transport equipment manufacturing</option>
        <option value="Utilities (water; gas; electricity)">Utilities (water; gas; electricity)</option>
        <option value="Other industries">Other industries</option>
    </select>
</div> */