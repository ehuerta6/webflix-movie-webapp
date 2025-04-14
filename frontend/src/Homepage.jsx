import { useTheme } from './ThemeProvider'
import profilePic from './assets/profile-pic.jpg'

function Homepage() {
  const { theme } = useTheme()

  // Mock data for the sections
  const inTheaters = [
    { id: 1, title: 'Dune: Part Two', genre: 'Sci-Fi', year: 2024 },
    { id: 2, title: 'Deadpool & Wolverine', genre: 'Action', year: 2024 },
    { id: 3, title: 'Godzilla x Kong', genre: 'Action', year: 2024 },
    { id: 4, title: 'A Quiet Place: Day One', genre: 'Horror', year: 2024 },
  ]

  const whatsPopular = [
    { id: 1, title: 'Oppenheimer', genre: 'Drama', year: 2023 },
    { id: 2, title: 'Barbie', genre: 'Comedy', year: 2023 },
    { id: 3, title: 'Mission: Impossible', genre: 'Action', year: 2023 },
    { id: 4, title: 'Past Lives', genre: 'Drama', year: 2023 },
  ]

  const topRatedMovies = [
    { id: 1, title: 'The Shawshank Redemption', genre: 'Drama', year: 1994 },
    { id: 2, title: 'The Godfather', genre: 'Crime', year: 1972 },
    { id: 3, title: 'The Dark Knight', genre: 'Action', year: 2008 },
    { id: 4, title: 'Pulp Fiction', genre: 'Crime', year: 1994 },
  ]

  const topRatedShows = [
    { id: 1, title: 'Breaking Bad', genre: 'Drama', year: 2008 },
    { id: 2, title: 'Game of Thrones', genre: 'Fantasy', year: 2011 },
    { id: 3, title: 'The Wire', genre: 'Crime', year: 2002 },
    { id: 4, title: 'Band of Brothers', genre: 'War', year: 2001 },
  ]

  // Helper function to render content sections
  const renderSection = (title, items) => (
    <section className="px-4 md:px-12 mb-12 max-w-7xl mx-auto">
      <h2 className={`text-2xl font-bold section-title ${theme}`}>{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg overflow-hidden shadow-lg movie-card ${
              theme === 'dark' ? 'bg-webflix-dark' : 'bg-gray-100'
            }`}
          >
            <img
              src={profilePic}
              alt={item.title}
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-sm md:text-lg mb-1 truncate">
                {item.title}
              </h3>
              <p
                className={`text-xs md:text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {item.genre} • {item.year}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <div
      className={`min-h-screen pt-20 pb-10 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-webflix-darker text-white'
          : 'bg-white text-gray-900'
      }`}
    >
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[70vh] w-full mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${profilePic})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative h-full flex flex-col justify-end p-4 md:p-12 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-white drop-shadow-lg">
            Featured Content
          </h1>
          <p className="text-sm md:text-lg mb-4 md:mb-6 text-gray-200 max-w-2xl drop-shadow-md">
            Discover the latest movies and shows on WEBFLIX. Stream now or add
            to your watchlist.
          </p>
          <div className="flex space-x-4">
            <button className="px-4 py-2 md:px-6 md:py-3 bg-webflix-cyan text-white font-semibold rounded hover:bg-opacity-80 transition duration-200 flex items-center text-sm md:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Watch Now
            </button>
            <button className="px-4 py-2 md:px-6 md:py-3 bg-gray-600 text-white font-semibold rounded hover:bg-opacity-80 transition duration-200 flex items-center text-sm md:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              Details
            </button>
          </div>
        </div>
      </section>

      {renderSection('In Theaters', inTheaters)}
      {renderSection("What's Popular", whatsPopular)}
      {renderSection('Top Rated Movies', topRatedMovies)}
      {renderSection('Top Rated Shows', topRatedShows)}
    </div>
  )
}

export default Homepage
