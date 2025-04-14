import profilePic from './assets/profile-pic.jpg'

function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h1 className="text-xl md:text-2xl font-bold text-[#5ccfee] tracking-wide hover:text-[#4ab3d3] transition-colors duration-200 cursor-pointer">
        WEBFLIX
      </h1>
      <nav className="flex items-center gap-2 md:gap-4">
        <button className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer">
          Home
        </button>
        <button className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer">
          Movies
        </button>
        <button className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer">
          Shows
        </button>
        <button className="text-sm md:text-base font-bold text-white hover:text-[#5ccfee] px-3 py-2 transition-all duration-200 hover:scale-105 cursor-pointer">
          Search
        </button>
        <button className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center ml-1 transition-transform duration-200 hover:scale-110 cursor-pointer">
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
