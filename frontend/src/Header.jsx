import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import { useAuth } from './context/AuthContext'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const { currentUser, userProfile, logout } = useAuth()
  const dropdownRef = useRef(null)

  // Get first letter of display name or email and capitalize it
  const getInitial = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase()
    } else if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearchClick = () => {
    navigate('/search')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      setShowDropdown(false)
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/user')
    setShowDropdown(false)
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
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 rounded-md transition-all duration-200 hover:bg-[#252525]"
              onClick={() => setShowDropdown(!showDropdown)}
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-[#5ccfee] flex items-center justify-center text-[#1a1a1a] font-bold">
                {getInitial()}
              </div>
              <span className="hidden md:block">
                {userProfile?.displayName || 'Profile'}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              <div className="absolute right-0 mt-2 py-2 w-56 bg-[#252525] rounded-md shadow-xl z-10 border border-[#333]">
                <div className="px-4 py-2 border-b border-[#333] mb-2">
                  <div className="text-sm font-medium text-white">
                    {userProfile?.displayName || 'User'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {currentUser?.email}
                  </div>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#333] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#333] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
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
