import { useState } from 'react'
import { Link } from 'react-router-dom'
import profilePic from './assets/profile-pic.jpg'
import SearchBar from './components/SearchBar'

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <header className="flex justify-between items-center px-6 py-4 bg-black text-white">
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-[#5ccfee] tracking-wide hover:text-[#4ab3d3] transition-colors duration-200 cursor-pointer no-underline app-link"
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

          {/* Search link - updated to navigate to search page */}
          <Link
            to="/search"
            className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline flex items-center app-link"
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

          {/* Authentication link - temporary for testing */}
          <Link
            to="/login"
            className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline app-link"
          >
            Login
          </Link>

          {/* Profile link - using the profile picture */}
          <Link
            to="/profile"
            className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ml-1 transition-transform duration-200 hover:scale-110 cursor-pointer no-underline app-link border border-transparent hover:border-[#5ccfee]"
          >
            <img
              src={profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>
        </nav>
      </header>
    </>
  )
}

export default Header
