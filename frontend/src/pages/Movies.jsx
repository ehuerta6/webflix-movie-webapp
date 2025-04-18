import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { fetchMovies, fetchGenres } from '../services/api'

function Movies() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [genres, setGenres] = useState([{ id: 0, name: 'All' }])

  // Sort options
  const sortOptions = ['Default', 'Top Rated', 'Newest', 'Most Popular']

  // Fetch movie genres when component mounts
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres('movie')
        if (genreData.genres && genreData.genres.length > 0) {
          setGenres([{ id: 0, name: 'All' }, ...genreData.genres])
        }
      } catch (err) {
        console.error('Error fetching genres:', err)
        setError('Failed to load genres. Please try again later.')
      }
    }

    loadGenres()
  }, [])

  // Fetch movies when component mounts
  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true)
      setError(null)

      try {
        // Create filter parameters for API call
        let params = {}

        // Add sorting parameters
        switch (sortBy) {
          case 'Top Rated':
            params.sort_by = 'vote_average.desc'
            break
          case 'Newest':
            params.sort_by = 'primary_release_date.desc'
            break
          case 'Most Popular':
            params.sort_by = 'popularity.desc'
            break
          default:
            params.sort_by = 'popularity.desc' // Default sort
        }

        // Add genre filter if not "All"
        if (selectedGenre !== 'All' && selectedGenre !== 0) {
          const genreId = genres.find((g) => g.name === selectedGenre)?.id
          if (genreId) params.with_genres = genreId
        }

        const data = await fetchMovies(params)

        if (data.results) {
          // Transform the data format to match what our components expect
          const formattedMovies = data.results.map((movie) => ({
            id: movie.id,
            type: 'movie',
            title: movie.title,
            poster: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null,
            rating: movie.vote_average.toFixed(1),
            genre:
              movie.genre_ids && movie.genre_ids.length > 0
                ? genres.find((g) => g.id === movie.genre_ids[0])?.name ||
                  'Unknown'
                : 'Unknown',
            year: movie.release_date
              ? movie.release_date.substring(0, 4)
              : 'Unknown',
            popularity: movie.popularity,
          }))

          setMovies(formattedMovies)
          setFilteredMovies(formattedMovies)
        } else {
          setError('No movies found. Please try again later.')
        }
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError('Failed to load movies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [sortBy, selectedGenre, genres])

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

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="flex flex-col items-center">
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#5ccfee] text-black rounded hover:bg-[#4ab9d9]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12 pt-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            Movies
          </h1>
          <p className="text-gray-400">
            Discover the latest and greatest in cinema
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
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
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
              {filteredMovies.length}{' '}
              {filteredMovies.length === 1 ? 'movie' : 'movies'} found
            </p>
          </div>
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
