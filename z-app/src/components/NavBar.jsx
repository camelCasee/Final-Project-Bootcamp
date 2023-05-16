    import { useContext } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Button from "./Button"
import { Context } from "./Context"

function NavBar() {
    const navigate = useNavigate()
    const { handleLogout, user} = useContext(Context)

    const userName = user && user.name

    const handlerLogoutClick = () => {
        sessionStorage.clear()
        handleLogout()

        navigate('/login')
    }

    return <footer className="z-20 bottom-0 fixed w-full h-20 bg-teal-300 grid grid-cols-12">
        <nav className="flex items-center justify-between p-4 h-20 col-start-1 col-end-13 text-2xl">
            <div className="z-10 flex gap-4">
                <Link className="text-lg" to={'/'}>Home</Link>
                {user?.role === 'worker' && <Link className="text-lg" to={'/offers'}>Offers</Link>}
                {user?.role === 'company' && <Link className="text-lg" to={'/curriculums'}>Cv's</Link>}
            </div>
            {user?.role === 'worker' && <Link to={'/worker/matchs'}>Matchs</Link>}
            {user?.role === 'company' && <Link to={'/company/matchs'}>Matchs</Link>}
            <div className="z-10 flex gap-4">
                <Link className="text-lg" to={'/user/profile'}>Profile</Link>
                <button className="text-lg" onClick={handlerLogoutClick}>Logout</button>
            </div>
        </nav>
    </footer>
}

export default NavBar