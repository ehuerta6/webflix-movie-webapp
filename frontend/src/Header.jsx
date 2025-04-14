import profilePic from './assets/profile-pic.jpg'
import ThemeToggle from './ThemeToggle'
import { useTheme } from './ThemeProvider'

function Header() {
  const { theme } = useTheme()

  return (
    <header
      className={`flex justify-between items-center px-8 py-4 ${
        theme === 'dark' ? 'bg-webflix-dark' : 'bg-webflix-light'
      } shadow-md fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}
    >
      <div className="flex items-center">
        <h1 className="text-3xl md:text-4xl logo-text tracking-wider text-webflix-cyan">
          WEBFLIX
        </h1>
      </div>

      <nav className="flex items-center gap-3 md:gap-4">
        <button
          className={`bg-transparent border-none ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } text-base cursor-pointer px-3 md:px-4 py-2 transition-colors duration-300 hover:bg-opacity-20 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } rounded-md`}
        >
          Home
        </button>
        <button
          className={`bg-transparent border-none ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } text-base cursor-pointer px-3 md:px-4 py-2 transition-colors duration-300 hover:bg-opacity-20 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } rounded-md`}
        >
          Movies
        </button>
        <button
          className={`bg-transparent border-none ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } text-base cursor-pointer px-3 md:px-4 py-2 transition-colors duration-300 hover:bg-opacity-20 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } rounded-md`}
        >
          Shows
        </button>
        <button
          className={`bg-transparent border-none ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } text-base cursor-pointer p-2 transition-colors duration-300 hover:bg-opacity-20 ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } rounded-full`}
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
        </button>
        <ThemeToggle />
        <button className="w-8 h-8 border-none p-0 bg-transparent rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
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
