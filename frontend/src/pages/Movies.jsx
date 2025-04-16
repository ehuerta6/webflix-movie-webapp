import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import placeholderImg from '../assets/profile-pic.jpg'

function Movies() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Default')

  // Available genres
  const genres = [
    'All',
    'Action',
    'Drama',
    'Comedy',
    'Sci-Fi',
    'Horror',
    'Romance',
    'Thriller',
    'Fantasy',
  ]

  // Sort options
  const sortOptions = ['Default', 'Top Rated', 'Newest', 'Most Popular']

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const movieData = generateMovieData(24)
      setMovies(movieData)
      setFilteredMovies(movieData)
      setLoading(false)
    }, 1000)
  }, [])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (movies.length === 0) return

    let result = [...movies]

    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter((movie) => movie.genre === selectedGenre)
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

    setFilteredMovies(result)
  }, [selectedGenre, sortBy, movies])

  // Generate mock movie data
  const generateMovieData = (count) => {
    const genres = [
      'Action',
      'Drama',
      'Comedy',
      'Sci-Fi',
      'Horror',
      'Romance',
      'Thriller',
      'Fantasy',
    ]
    const years = ['2023', '2022', '2021', '2020', '2024']
    const movieTitles = [
      'The Last Journey',
      'Eternal Sunshine',
      'Dark Knight',
      'Lost in Space',
      'The Great Adventure',
      'Red Horizon',
      'Whispers in the Dark',
      'Frozen Heart',
      'Lightning Strike',
      'Silent Echo',
      'Through the Fire',
      'Midnight Hour',
      'Brave New World',
      'Golden Age',
      'Beyond the Stars',
      'The Secret Door',
    ]

    return Array.from({ length: count }, (_, i) => ({
      id: `movie-${i}`,
      type: 'movie',
      title:
        movieTitles[i % movieTitles.length] +
        (i > movieTitles.length
          ? ` ${Math.floor(i / movieTitles.length) + 1}`
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
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12 pt-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            Movies
          </h1>
          <p className="text-gray-400">
            Discover the latest and greatest in cinema
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
            {filteredMovies.length}{' '}
            {filteredMovies.length === 1 ? 'movie' : 'movies'} found
          </p>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-400">
                No movies match your filters. Try changing your selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Movies
