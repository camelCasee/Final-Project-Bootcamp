import { useContext, useState } from "react"
import NavBar from "../components/NavBar"
import { Context } from "../components/Context"
import SearchButton from "../components/SearchButton"
import SearchPanel from "../components/SearchPanel"

function Home() {
    const [searchPanelStatus, setSearchPanelStatus] = useState()
    const { user } = useContext(Context)

    // useEffect(() => {
    //     try {
    //         retrieveMatchsNotificationsAmount(sessionStorage.token)
    //             .then(amountOfNotifications => {
    //                 matchsNotifications(amountOfNotifications)
    //             })
    //     } catch (error) {
    //         const { errorMessage, type } = errorHandling(error)
    //         showAlert(errorMessage, type)
    //     }
    // }, [])

    const onSearchClick = () => {
        setSearchPanelStatus(true)
    }

    const closeSearchPanel = () => {
        setSearchPanelStatus()
    }

    const userName = user && user.name

    return <main className="min-h-screen bg-slate-100">
        <SearchButton
            onSearchClick={onSearchClick}
        />
        {searchPanelStatus && <SearchPanel
            className={"inset-x-[2.5%] inset-y-[15%] absolute"}
            closeSearchPanel={closeSearchPanel}
        />}
        <div className="flex items-center flex-col">
                <div className="flex justify-center items-center font-semibold text-lg border-2 shadow-sm shadow-slate-600 w-5/6 h-20 z-10 rounded-xl bg-emerald-300 cursor-pointer">
                <h2 className="ml-2">{`Hola ${userName}`}</h2>
                </div>
            </div>
        <NavBar
        />
    </main>
}

export default Home