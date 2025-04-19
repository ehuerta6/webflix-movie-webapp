import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import { useAuth } from './context/AuthContext'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleSearchClick = () => {
    navigate('/search')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#1a1a1a] border-b border-[#2a2a2a] text-white">
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-[#00BFFF] tracking-wide transition-transform duration-200 hover:scale-105 cursor-pointer no-underline app-link"
      >
        WEBFLIX
      </Link>
      <nav className="flex items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline app-link"
        >
          Home
        </Link>
        <Link
          to="/movies"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline app-link"
        >
          Movies
        </Link>
        <Link
          to="/shows"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline app-link"
        >
          Shows
        </Link>

        <Link
          to="/search"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer flex items-center no-underline app-link"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="ml-1 hidden md:inline">Search</span>
        </Link>

        {currentUser ? (
          <div className="relative">
            <button
              className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer flex items-center"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Profile
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showDropdown ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-[#252525] rounded-md shadow-xl z-10">
                <Link
                  to="/user"
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#333] hover:text-white"
                  onClick={() => setShowDropdown(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setShowDropdown(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#333] hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline app-link"
          >
            Login
          </Link>
        )}
      </nav>

      {isSearchOpen && (
        <SearchBar
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  )
}

export default Header
