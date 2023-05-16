import Button from "./Button"
import { useContext } from 'react'
import { Context } from "./Context"
import { useNavigate } from 'react-router-dom'

function SearchPanel({ className, closeSearchPanel }) {
    const navigate = useNavigate()

    const { user: { role } } = useContext(Context)

    const searchHandler = event => {
        event.preventDefault()
        const { keyWord: { value: keyWord }, location: { value: location } } = event.target

        if (role === 'worker') {
            if (keyWord && location)
                navigate(`/search/offers?q=${keyWord}&location=${location}`)
            else if (keyWord)
                navigate(`/search/offers?q=${keyWord}`)
            else if (location)
                navigate(`/search/offers?location=${location}`)

            closeSearchPanel()
        }
        else if (role === 'company') {
            if (keyWord && location)
                navigate(`/search/curriculums?q=${keyWord}&location=${location}`)
            else if (keyWord)
                navigate(`/search/curriculums?q=${keyWord}`)
            else if (location)
                navigate(`/search/curriculums?location=${location}`)

            closeSearchPanel()
        }
    }

    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeSearchPanel}>
        <div onClick={event => event.stopPropagation()} className={`shadow-lg shadow-slate-400 w-[95%] h-[20%] bg-white border-2 p-6 rounded-xl ${className ? className : ""}`}>
            <form onSubmit={searchHandler}>
                <div className="flex flex-col gap-2">
                    <input autoFocus className="outline-none p-1 w-full rounded-lg bg-slate-100" name='keyWord' id='keyWord' type="text" placeholder="Put a key word" />
                    <input className="outline-none p-1 w-full rounded-lg bg-slate-100" type="text" name="location" id="location" placeholder="Location" />
                </div>
                <div className='flex justify-between gap-4 mt-5'>
                    <Button className="text-md bg-emerald-200 w-1/2" type='button' onClick={closeSearchPanel}>Cancel</Button>
                    <Button className="text-md bg-green-400 w-1/2">Search</Button>
                </div>
            </form>
        </div>
    </div>
}

export default SearchPanel
