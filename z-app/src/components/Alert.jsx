import { useEffect } from 'react'
import Button from './Button'

function Alert({message, level, onAlertClose}) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'

        const color = level === 'fatal' || level === 'error' ? 'red' : level === 'warn' ? 'gold' : level === 'info' ? 'blue' : 'green'

        document.querySelector('#alert').style.borderColor = color

        return () => document.body.style = ''
    })


    const closeAlert = () => {
        onAlertClose()
    }
    return <div className="z-20 fixed w-screen h-screen bg-[#aaaa] inset-y-0" onClick={closeAlert}>
        <div id='alert' onClick={event => event.stopPropagation()} className={`inset-x-[8.3%] inset-y-1/3 absolute shadow-lg shadow-slate-400 w-5/6 h-fit bg-white border-2 p-4 rounded-xl`}>
            <p className='text-center font-semibold text-lg'>{message}</p>
            <div className='flex justify-end gap-4 mt-5'>
                <Button className="text-md bg-emerald-200 w-1/3" onClick={closeAlert}>Ok</Button>
            </div>
        </div>
    </div>
}

export default Alert