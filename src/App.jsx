import './App.css'
import CurrentCapitalRaidContainer from './components/CurrentCapitalRaidContainer/currentCapitalRaidContainer.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ClanAndMembers from './components/ClanAndMembers/ClanAndMembers.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import MemberDetailContainer from './components/MemberDetailContainer/MemberDetailContainer.jsx'
import CurrentWar from './components/CurrentWar/CurrentWar.jsx'
import CheckDonations from './components/CheckDonations/CheckDonations.jsx'
import Rankings from './components/Rankings/Rankings.jsx'
import ClanWarLeague from './components/ClanWarLeague/ClanWarLeague.jsx'
import Home from './components/Home/Home.jsx'

function App() {
  return (
    <BrowserRouter>
      
      <Navbar/>

      <Routes>

        <Route path='/' element={ <Home/> } />

        <Route path='/losMagiosClan' element={ <ClanAndMembers/> } />

        <Route path='/currentWar' element={ <CurrentWar/> } />

        <Route path='/warleague' element={ <ClanWarLeague/> } />

        <Route path='/capitalRaid' element={ <CurrentCapitalRaidContainer/> } />

        <Route path='/checkDonations' element={ <CheckDonations/> } />

        <Route path='/rankings' element={ <Rankings /> }/>

        <Route path='/player/:PLAYERTAG' element={ <MemberDetailContainer/> } />

        <Route path="*" element={<h1 style={{ color: 'red' }}>Error 404. Page not found</h1>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
