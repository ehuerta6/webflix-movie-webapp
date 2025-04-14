import profilePic from './assets/profile-pic.jpg'

function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-black text-white shadow-lg border-b border-[#222]">
      <h1 className="m-0 text-[2rem] font-extrabold tracking-wide text-[#00b7eb] font-sans">
        WEBFLIX
      </h1>
      <nav className="flex items-center gap-4">
        <button className="bg-transparent border-none text-white text-base cursor-pointer px-4 py-2 transition-colors duration-300 hover:text-[#00b7eb] rounded-md">
          Home
        </button>
        <button className="bg-transparent border-none text-white text-base cursor-pointer px-4 py-2 transition-colors duration-300 hover:text-[#00b7eb] rounded-md">
          Movies
        </button>
        <button className="bg-transparent border-none text-white text-base cursor-pointer px-4 py-2 transition-colors duration-300 hover:text-[#00b7eb] rounded-md">
          Shows
        </button>
        <button className="bg-transparent border-none text-white text-base cursor-pointer px-4 py-2 transition-colors duration-300 hover:text-[#00b7eb] rounded-md">
          Search
        </button>
        <button className="w-8 h-8 border-2 border-[#00b7eb] p-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover rounded-full hover:cursor-pointer"
          />
        </button>
      </nav>
    </header>
  )
}

export default Header
