import { useState } from "react"

function MatchsNotificationsAmount({ className, matchsNotificationsAmount }) {
    const [matchsCounter, setMatchsCounter] = useState(matchsNotificationsAmount)

    return <div className={`flex justify-center shadow-lg shadow-slate-400 h-6 w-6 bg-red-300 z-20 rounded-2xl ${className ? className : ""}`}>
        <span className="text-sm">{matchsNotificationsAmount}</span>
    </div>
}

export default MatchsNotificationsAmount