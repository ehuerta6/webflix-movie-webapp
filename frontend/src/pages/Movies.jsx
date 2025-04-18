import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { fetchMovies, fetchGenres } from '../services/api'

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate pagination range
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    const halfRange = Math.floor(maxPagesToShow / 2)

    let startPage = Math.max(currentPage - halfRange, 1)
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-10">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage === 1
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
        }`}
      >
        ← Prev
      </button>

      {/* First Page */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === 1
                ? 'bg-[#5ccfee] text-black font-medium'
                : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
            }`}
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded-md text-sm ${
            currentPage === pageNumber
              ? 'bg-[#5ccfee] text-black font-medium'
              : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Last Page */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? 'bg-[#5ccfee] text-black font-medium'
                : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-sm ${
          currentPage === totalPages
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
            : 'bg-[#1e1e1e] text-white hover:bg-[#2e2e2e]'
        }`}
      >
        Next →
      </button>
    </div>
  )
}

function Movies() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [genres, setGenres] = useState([{ id: 0, name: 'All' }])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const ITEMS_PER_PAGE = 50

  // Sort options
  const sortOptions = ['Default', 'Top Rated', 'Newest', 'Most Popular']

  // Fetch movie genres when component mounts
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres('movie')
        if (genreData && Array.isArray(genreData)) {
          setGenres([{ id: 0, name: 'All' }, ...genreData])
        }
      } catch (err) {
        console.error('Error fetching genres:', err)
        setError('Failed to load genres. Please try again later.')
      }
    }

    loadGenres()
  }, [])

  // Fetch movies when component mounts or when filters/page changes
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
            params['vote_count.gte'] = 100 // Ensure quality ratings
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

        const data = await fetchMovies(params, currentPage, ITEMS_PER_PAGE)

        if (data.results) {
          // Update pagination information
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages) // TMDB API limits to 500 pages max
          setTotalResults(data.total_results)

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

    // Only load if genres are loaded
    if (genres.length > 1) {
      loadMovies()
    }
  }, [sortBy, selectedGenre, genres, currentPage])

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading && currentPage === 1) {
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
                onChange={(e) => {
                  setSelectedGenre(e.target.value)
                  setCurrentPage(1) // Reset to page 1 when changing filters
                }}
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
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setCurrentPage(1) // Reset to page 1 when changing filters
                }}
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
                      onClick={() => {
                        setSelectedGenre('All')
                        setCurrentPage(1) // Reset to page 1 when changing filters
                      }}
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
                      onClick={() => {
                        setSortBy('Default')
                        setCurrentPage(1) // Reset to page 1 when changing filters
                      }}
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
                      setCurrentPage(1) // Reset to page 1 when changing filters
                    }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count and pagination info */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-400 text-xs">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  {filteredMovies.length > 0 ? (
                    <>
                      {totalResults.toLocaleString()} movies found • Page{' '}
                      {currentPage} of {totalPages}
                    </>
                  ) : (
                    'No movies found'
                  )}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Loading overlay for page changes */}
        {loading && currentPage > 1 && (
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#121212]/70 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin mr-2"></div>
                <p className="text-gray-400 text-sm">
                  Loading page {currentPage}...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}

export default Movies
