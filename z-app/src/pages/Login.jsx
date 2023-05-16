import authenticateUser from "../logic/authenticateUser"
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { Context } from "../components/Context"
import errorHandling from "../utils/errorHandling"

function Login({ onLoggedIn }) {
    const navigate = useNavigate()

    const { showAlert } = useContext(Context)

    const handleSubmit = event => {
        event.preventDefault()

        const { email: { value: email }, password: { value: password } } = event.target

        try {
            authenticateUser(email, password)
                .then(token => {
                    sessionStorage.token = token

                    onLoggedIn()

                    navigate('/')
                })
                .catch(error => {
                    const { errorMessage, type } = errorHandling(error)

                    showAlert(errorMessage, type)

                    event.target.password.value = ''
                })
        } catch (error) {
                    const { errorMessage, type } = errorHandling(error)

                    showAlert(errorMessage, type)

            event.target.password.value = ''
        }

    }

    return <div className="flex h-screen justify-center items-center bg-slate-100">
        <form onSubmit={handleSubmit} className="w-4/5 shadow-lg shadow-slate-400 border-2 bg-teal-300 flex flex-col gap-2 justify-center items-center p-8 rounded-lg">
            <h2 className='text-2xl font-bold'>Log in</h2>
            <label htmlFor="email" className="self-start">E-mail</label>
            <input autoFocus className="outline-none p-1 w-full rounded-lg bg-slate-100" type="email" placeholder="Input your E-mail" name="email" id="email" />
            <label htmlFor="password" className="self-start">Password</label>
            <input className="outline-none p-1 w-full rounded-lg bg-slate-100" type="password" placeholder="Input you password" name="password" id="password" />
            <button className="p-1 rounded-lg mt-3.5 w-full bg-slate-100">Log in</button>
            <hr className="w-full border-black mt-3.5" />
            <div className="div-register mt-2">
                <p>Didnt have an account?</p>
                <Link to='/register' className="p-1 block text-center rounded-lg mt-3.5 w-full bg-slate-100">Register</Link>
            </div>
        </form>
    </div>
}

export default Login