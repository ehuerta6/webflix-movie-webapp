import { Link } from 'react-router-dom'
import profilePic from './assets/profile-pic.jpg'

function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-[#5ccfee] tracking-wide hover:text-[#4ab3d3] transition-colors duration-200 cursor-pointer no-underline"
      >
        WEBFLIX
      </Link>
      <nav className="flex items-center gap-2 md:gap-4">
        <Link
          to="/"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline"
        >
          Home
        </Link>
        <Link
          to="/browse/movies"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline"
        >
          Movies
        </Link>
        <Link
          to="/browse/shows"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline"
        >
          Shows
        </Link>
        <Link
          to="/search"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline"
        >
          Search
        </Link>

        {/* Authentication link - temporary for testing */}
        <Link
          to="/login"
          className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer no-underline"
        >
          Login
        </Link>

        {/* Profile link - using the profile picture */}
        <Link
          to="/profile"
          className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ml-1 transition-transform duration-200 hover:scale-110 cursor-pointer no-underline border border-transparent hover:border-[#5ccfee]"
        >
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
      </nav>
    </header>
  )
}

export default Header
