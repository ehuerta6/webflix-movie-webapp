import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './pages/Home'
import About from './pages/About'
import Details from './pages/Details'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/:type/:id" element={<Details />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
