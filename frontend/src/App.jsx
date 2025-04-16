import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import About from './pages/About'
import Details from './pages/Details'
import Movies from './pages/Movies'
import Shows from './pages/Shows'
import SearchPage from './pages/SearchPage'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/:type/:id" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
