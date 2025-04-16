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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            TV Shows
          </h1>
          <p className="text-gray-400">
            Discover the best series to binge watch
          </p>
        </div>

        {/* Filter Bar - Sticky at the top */}
        <div className="sticky top-0 z-10 bg-[#121212] py-4 border-b border-[#1e1e1e] mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Genre Filter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="genre-select" className="text-sm text-gray-400">
                Genre
              </label>
              <select
                id="genre-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-[#1e1e1e] text-white px-4 py-2 rounded-md border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee] min-w-[150px]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="sort-select" className="text-sm text-gray-400">
                Sort By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#1e1e1e] text-white px-4 py-2 rounded-md border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee] min-w-[150px]"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filters Display */}
            <div className="md:ml-auto">
              {(selectedGenre !== 'All' || sortBy !== 'Default') && (
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-sm text-gray-400">Active filters:</span>
                  {selectedGenre !== 'All' && (
                    <span className="bg-[#5ccfee20] text-[#5ccfee] text-xs px-3 py-1 rounded-full">
                      {selectedGenre}
                    </span>
                  )}
                  {sortBy !== 'Default' && (
                    <span className="bg-[#5ccfee20] text-[#5ccfee] text-xs px-3 py-1 rounded-full">
                      {sortBy}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedGenre('All')
                      setSortBy('Default')
                    }}
                    className="text-xs text-gray-400 hover:text-white underline"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm">
            {filteredShows.length}{' '}
            {filteredShows.length === 1 ? 'show' : 'shows'} found
          </p>
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
