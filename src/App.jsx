import './App.css'
import CurrentCapitalRaidContainer from './components/CurrentCapitalRaidContainer/currentCapitalRaidContainer.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ClanAndMembers from './components/ClanAndMembers/ClanAndMembers.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import MemberDetailContainer from './components/MemberDetailContainer/MemberDetailContainer.jsx'
import CurrentWar from './components/CurrentWar/CurrentWar.jsx'
import CheckDonations from './components/CheckDonations/CheckDonations.jsx'
import Rankings from './components/Rankings/Rankings.jsx'
import Home from './components/Home/Home.jsx'

function App() {
  return (
    <BrowserRouter>
      
      <Navbar/>

      <Routes>

        <Route path='/' element={ <Home/> } />

        <Route path='/capitalRaid' element={ <CurrentCapitalRaidContainer/> } />

        <Route path='/losMagiosClan' element={ <ClanAndMembers/> } />

        <Route path='/player/:PLAYERTAG' element={ <MemberDetailContainer/> } />

        <Route path='/currentWar' element={ <CurrentWar/> } />

        <Route path='/checkDonations' element={ <CheckDonations/> } />

        <Route path='/rankings' element={ <Rankings /> }/>

        <Route path="*" element={<h1 style={{ color: 'red' }}>Error 404. Page not found</h1>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
