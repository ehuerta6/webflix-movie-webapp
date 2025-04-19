import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import { useAuth } from './context/AuthContext'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const navigate = useNavigate()
  const { currentUser, userProfile, logout } = useAuth()

  const handleSearchClick = () => {
    navigate('/search')
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(true)
  }

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate('/')
        setShowLogoutConfirm(false)
      })
      .catch((error) => {
        console.error('Failed to log out', error)
        setShowLogoutConfirm(false)
      })
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // Get capitalized initial for avatar
  const getInitial = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName.charAt(0).toUpperCase()
    } else if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }
    return 'U'
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
            <div className="flex items-center gap-2">
              {/* User info display */}
              <Link to="/user" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#5ccfee] flex items-center justify-center text-[#1a1a1a] font-bold group-hover:ring-2 group-hover:ring-white transition-all">
                  {getInitial()}
                </div>
                <span className="hidden md:block text-sm font-medium text-white group-hover:text-[#5ccfee]">
                  {userProfile?.displayName || 'Profile'}
                </span>
              </Link>

              {/* Logout button that matches header aesthetic */}
              <button
                onClick={confirmLogout}
                className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer flex items-center"
                aria-label="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
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
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>

            {/* Logout confirmation dialog */}
            {showLogoutConfirm && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-[#252525] rounded-md shadow-xl border border-[#333] z-30 w-60">
                <p className="text-sm text-white mb-3 font-medium">
                  Are you sure you want to logout?
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelLogout}
                    className="px-3 py-1.5 bg-[#333] text-white text-sm rounded-md hover:bg-[#444] transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-[#00BFFF] text-white text-sm rounded-md hover:bg-[#5ccfee] transition-colors"
                  >
                    Yes
                  </button>
                </div>
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
