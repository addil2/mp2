import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import DiscoverPage from './pages/DiscoverPage'
import MealPage from './pages/MealPage'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/meal/:id" element={<MealPage />} />
      </Routes>
    </>
  )
}

export default App