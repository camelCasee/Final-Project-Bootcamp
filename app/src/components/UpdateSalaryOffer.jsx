import { useState, useEffect, useContext } from 'react'
import updateOffer from '../logic/updateOffer'
import errorHandling from '../utils/errorHandling'
import Button from './Button'
import { Context } from './Context'

function UpdateSalaryOffer({ className, onUpdateSalaryOfferClose, onUpdateSalaryOffer, offerSalaryData }) {
    const [salary, setSalary] = useState(offerSalaryData.salary)

    const { showAlert } = useContext(Context)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return () => document.body.style = ''
    })

    const updateOfferSalary = event => {
        event.preventDefault()

        const { amount: { value: amount }, currency: { value: currency } } = event.target

        const salary = { salary: parseInt(amount), currency }

        try {
            updateOffer(sessionStorage.token, offerSalaryData.offerId, offerSalaryData.offerUserId, { salary })
                .then(() => onUpdateSalaryOffer())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const deleteOfferSalary = event => {
        event.preventDefault()

        try {
            updateOffer(sessionStorage.token, offerSalaryData.offerId, offerSalaryData.offerUserId, { salary: {} })
                .then(() => onUpdateSalaryOffer())
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)
                    showAlert(errorMessage, type)
                })
        } catch (error) {
            const { errorMessage, type } = errorHandling(error)
            showAlert(errorMessage, type)
        }
    }

    const closeSalaryOfferHandler = () => {
        onUpdateSalaryOfferClose()
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeSalaryOfferHandler}>
        <article onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-fit bg-white border-2 p-2 rounded-xl ${className ? className : ""}`}>
            <div className="flex flex-col items-center">
                <div className="grid w-full items-center grid-cols-12">
                    <span className="font-bold text-xl w-fit col-start-2 col-end-11">Update Annual Salary</span>
                    <button className="border-2 w-fit h-fit justify-self-end col-start-12 col-end-13 px-2 py-1 rounded-xl" onClick={closeSalaryOfferHandler}>X</button>
                </div>
                <hr className="w-full mt-3.5" />
                <form onSubmit={updateOfferSalary} className='w-full p-2'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex justify-center gap-2'>
                            <span className='font-semibold py-2.5'>Salary:</span>
                            <input name="amount" id="amount" autoFocus type="text" maxLength='8' placeholder='Salary' className='w-1/3 py-2.5  outline-none rounded-md' defaultValue={salary?.salary && salary.salary} />
                            <select name="currency" id="currency" defaultValue={salary?.currency ? salary.currency : '$'}
                                className="text-md w-1/6 block py-2.5 px-0 text-gray-700 bg-transparent border-0 border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
                                <option value="$">$</option>
                                <option value="€">€</option>
                            </select>
                        </div>
                        <div className='w-[80%] flex gap-4'>
                            <Button onClick={deleteOfferSalary} type='button' className="p-3 w-1/2 bg-red-400">Delete</Button>
                            <Button className="p-3 w-1/2 bg-green-400">Save</Button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    </div>
}
export default UpdateSalaryOffer