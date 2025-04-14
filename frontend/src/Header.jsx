import profilePic from './assets/profile-pic.jpg'

function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-[#1e1e1e] text-white">
      <h1 className="text-xl md:text-2xl font-medium text-[#5ccfee]">
        WEBFLIX
      </h1>
      <nav className="flex items-center gap-2 md:gap-3">
        <button className="text-sm md:text-base text-white hover:text-[#5ccfee] px-3 py-2 transition-colors">
          Home
        </button>
        <button className="text-sm md:text-base text-white hover:text-[#5ccfee] px-3 py-2 transition-colors">
          Movies
        </button>
        <button className="text-sm md:text-base text-white hover:text-[#5ccfee] px-3 py-2 transition-colors">
          Shows
        </button>
        <button className="text-sm md:text-base text-white hover:text-[#5ccfee] px-3 py-2 transition-colors">
          Search
        </button>
        <button className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ml-1">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </nav>
    </header>
  )
}

export default Header
