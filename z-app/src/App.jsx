import React from "react";
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Context } from "./components/Context";
import retrieveUser from "./logic/retrieveUser";
import UserOffers from "./pages/UserOffers";
import OfferDetail from "./pages/OfferDetail";
import CurriculumDetail from "./pages/CurriculumDetail"
import SearchedOffers from "./pages/SearchedOffers";
import PublishedOffers from "./pages/PublishedOffers";
import PublishedCurriculums from "./pages/PublishedCurriculums";
import UserCurriculums from "./pages/UserCurriculums";
import Alert from './components/Alert'
import errorHandling from "./utils/errorHandling";
import SearchedCurriculums from "./pages/SearchedCurriculums";
import WorkerMatchs from "./pages/WorkerMatchs";
import CompanyMatchs from "./pages/CompanyMatchs";
import retrieveMatchsNotificationsAmount from "./logic/retrieveMatchsNotificationsAmount";
import MatchsNotificationsAmount from "./components/MatchsNotificationsAmount";

function App() {
  const [user, setUser] = useState()
  const [message, setMessage] = useState()
  const [level, setLevel] = useState()
  const [matchsNotificationsAmountIntervalId, setMatchsNotificationsAmountIntervalId] = useState()
  const [matchsNotificationsAmount, setMatchsNotificationsAmount] = useState(0)

  useEffect(() => {
    if (sessionStorage.token) {
      retrieveUserHandler()

      retrieveMatchsNotificationsHandler()

      const intervalId = setInterval(() => {
        retrieveMatchsNotificationsHandler()
      }, 5000)

      setMatchsNotificationsAmountIntervalId(intervalId)
    }
  }, [])

  const retrieveUserHandler = () => {
    try {
      retrieveUser(sessionStorage.token)
        .then(user => setUser(user))
        .catch(error => {
          const { errorMessage, type } = errorHandling(error)
          showAlert(errorMessage, type)
        })
    } catch (error) {
      const { errorMessage, type } = errorHandling(error)
      showAlert(errorMessage, type)
    }
  }

  const retrieveMatchsNotificationsHandler = () => {
    try {
      retrieveMatchsNotificationsAmount(sessionStorage.token)
        .then(amountOfNotifications => {
          setMatchsNotificationsAmount(matchsNotificationsAmount => matchsNotificationsAmount + amountOfNotifications)
        })
    } catch (error) {
      const { errorMessage, type } = errorHandling(error)
      showAlert(errorMessage, type)
    }
  }

  const onOpenMatchs = () => {
    setMatchsNotificationsAmount(0)
  }

  const onLoggedIn = () => {
    retrieveUserHandler()

    retrieveMatchsNotificationsHandler()
    
    const intervalId = setInterval(() => {
      retrieveMatchsNotificationsHandler()
    }, 5000)

    setMatchsNotificationsAmountIntervalId(intervalId)
  }

  const handleLogout = () => {
    setUser()

    clearInterval(matchsNotificationsAmountIntervalId)
  }

  const showAlert = (message, level = 'error') => {
    setMessage(message)
    setLevel(level)
  }

  const closeAlert = () => setMessage()

  return (
    <Context.Provider value={{ handleLogout, user, showAlert }}>
      <Routes>
        {<Route path="/login"
          element={sessionStorage.token ? <Navigate replace to="/" /> : <Login onLoggedIn={onLoggedIn} />}
        />}
        {<Route path="/register"
          element={sessionStorage.token ? <Navigate replace to="/" /> : <Register />}
        />}
        {<Route path="/"
          element={sessionStorage.token ? <Home /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/offers"
          element={sessionStorage.token ? <PublishedOffers /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/curriculums"
          element={sessionStorage.token ? <PublishedCurriculums /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/user/profile"
          element={!sessionStorage.token ? <Navigate replace to="/login" /> : user?.role === 'company' ? <UserOffers /> :
            user?.role === 'worker' ? <UserCurriculums /> : null}
        />}
        {<Route path="/offers/:offerId"
          element={sessionStorage.token ? <OfferDetail /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/curriculums/:curriculumId"
          element={sessionStorage.token ? <CurriculumDetail /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/search/offers"
          element={sessionStorage.token ? <SearchedOffers /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/search/curriculums"
          element={sessionStorage.token ? <SearchedCurriculums /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/worker/matchs"
          element={sessionStorage.token ? <WorkerMatchs onOpenMatchs={onOpenMatchs} /> : <Navigate replace to="/login"
          />}
        />}
        {<Route path="/company/matchs"
          element={sessionStorage.token ? <CompanyMatchs onOpenMatchs={onOpenMatchs} /> : <Navigate replace to="/login"
          />}
        />}

      </Routes>
      {message && <Alert message={message} level={level} onAlertClose={closeAlert} />}
      {sessionStorage.token && <MatchsNotificationsAmount matchsNotificationsAmount={matchsNotificationsAmount}
        className="left-[55%] bottom-[5%] absolute" />}
    </Context.Provider>
  )
}

export default App;
