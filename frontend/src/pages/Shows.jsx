import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import placeholderImg from '../assets/profile-pic.jpg'

function Shows() {
  const [shows, setShows] = useState([])
  const [filteredShows, setFilteredShows] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Default')

  // Available genres
  const genres = [
    'All',
    'Drama',
    'Comedy',
    'Sci-Fi',
    'Horror',
    'Action',
    'Adventure',
    'Mystery',
    'Fantasy',
    'Thriller',
    'Crime',
  ]

  // Sort options
  const sortOptions = ['Default', 'Top Rated', 'Newest', 'Most Popular']

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const showData = generateShowData(24)
      setShows(showData)
      setFilteredShows(showData)
      setLoading(false)
    }, 1000)
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (shows.length === 0) return

    let result = [...shows]

    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter((show) => show.genre === selectedGenre)
    }

    // Apply sorting
    switch (sortBy) {
      case 'Top Rated':
        result = [...result].sort(
          (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
        )
        break
      case 'Newest':
        result = [...result].sort((a, b) => parseInt(b.year) - parseInt(a.year))
        break
      case 'Most Popular':
        // Simulating popularity with a random factor for demo purposes
        result = [...result].sort((a, b) => b.popularity - a.popularity)
        break
      default:
        // Default sort - keep original order
        break
    }

    setFilteredShows(result)
  }, [selectedGenre, sortBy, shows])

  // Generate mock TV show data
  const generateShowData = (count) => {
    const genres = [
      'Drama',
      'Comedy',
      'Sci-Fi',
      'Horror',
      'Action',
      'Adventure',
      'Mystery',
      'Fantasy',
      'Thriller',
      'Crime',
    ]
    const years = ['2023', '2022', '2021', '2020', '2024']
    const showTitles = [
      'Stranger Things',
      'The Crown',
      'Breaking Bad',
      'The Mandalorian',
      'Game of Thrones',
      'The Office',
      'Dark Matter',
      'Westworld',
      'The Last of Us',
      'Black Mirror',
      'Better Call Saul',
      'The Walking Dead',
      'The Witcher',
      'Succession',
      'Euphoria',
      'The Boys',
    ]

    return Array.from({ length: count }, (_, i) => ({
      id: `show-${i}`,
      type: 'tv',
      title:
        showTitles[i % showTitles.length] +
        (i > showTitles.length
          ? ` ${Math.floor(i / showTitles.length) + 1}`
          : ''),
      poster: null,
      rating: (Math.random() * 5 + 5).toFixed(1),
      genre: genres[Math.floor(Math.random() * genres.length)],
      year: years[Math.floor(Math.random() * years.length)],
      popularity: Math.random() * 10, // Random popularity score for sorting
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-400">Loading shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12 pt-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            TV Shows
          </h1>
          <p className="text-gray-400">
            Discover the best series to binge watch
          </p>
        </div>

        {/* Minimal Filter Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Genre Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="appearance-none bg-[#1e1e1e] text-white text-sm font-medium px-3 py-1.5 pr-8 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5ccfee] cursor-pointer"
              >
                <option value="" disabled>
                  Genre
                </option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#1e1e1e] text-white text-sm font-medium px-3 py-1.5 pr-8 rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5ccfee] cursor-pointer"
              >
                <option value="" disabled>
                  Sort By
                </option>
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Active Filters Pills */}
            {(selectedGenre !== 'All' || sortBy !== 'Default') && (
              <div className="flex items-center flex-wrap gap-2 ml-auto">
                {selectedGenre !== 'All' && (
                  <span className="bg-[#5ccfee15] text-white text-xs px-2.5 py-1 rounded-md flex items-center">
                    {selectedGenre}
                    <button
                      onClick={() => setSelectedGenre('All')}
                      className="ml-1.5 text-gray-400 hover:text-white"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {sortBy !== 'Default' && (
                  <span className="bg-[#5ccfee15] text-white text-xs px-2.5 py-1 rounded-md flex items-center">
                    {sortBy}
                    <button
                      onClick={() => setSortBy('Default')}
                      className="ml-1.5 text-gray-400 hover:text-white"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )}
                {(selectedGenre !== 'All' || sortBy !== 'Default') && (
                  <button
                    onClick={() => {
                      setSelectedGenre('All')
                      setSortBy('Default')
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className="text-gray-400 text-xs">
              {filteredShows.length}{' '}
              {filteredShows.length === 1 ? 'show' : 'shows'} found
            </p>
          </div>
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {filteredShows.length > 0 ? (
            filteredShows.map((show) => (
              <MovieCard key={show.id} movie={show} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400">
                No shows match your filters. Try changing your selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shows
