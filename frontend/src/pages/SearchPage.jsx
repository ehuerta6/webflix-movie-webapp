import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'
import {
  searchTMDB,
  fetchGenres,
  searchByGenre,
  fetchMovies,
  fetchShows,
  fetchTrending,
} from '../services/api'

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

function SearchPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''

  const [searchResults, setSearchResults] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [loadingPopular, setLoadingPopular] = useState(false)
  const [error, setError] = useState(null)
  const [genreMap, setGenreMap] = useState({})
  const [genreList, setGenreList] = useState([])
  const [isGenreSearch, setIsGenreSearch] = useState(false)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const ITEMS_PER_PAGE = 20

  // Helper function to validate if content has required information
  const isValidContent = (item) => {
    if (!item) return false

    // Basic requirements for all types
    const hasIdentifier = item.id > 0
    const hasTitle = item.title || item.name

    // Different validations based on media type
    if (item.media_type === 'movie') {
      // For movies: need at least title and either poster or overview
      return hasIdentifier && hasTitle && (item.poster_path || item.overview)
    } else if (item.media_type === 'tv') {
      // For TV shows: need at least title and either poster or overview
      return hasIdentifier && hasTitle && (item.poster_path || item.overview)
    } else if (item.media_type === 'person') {
      // For people: need at least name and profile path
      return hasIdentifier && hasTitle && item.profile_path
    }

    // If media_type is not specified, use generic validation
    return (
      hasIdentifier &&
      hasTitle &&
      (item.poster_path || item.profile_path || item.overview)
    )
  }

  // Load genres for proper display and search
  useEffect(() => {
    const loadGenres = async () => {
      try {
        // Fetch movie genres
        const movieGenres = await fetchGenres('movie')
        // Fetch TV genres
        const tvGenres = await fetchGenres('tv')

        // Combine genres and remove duplicates
        const allGenres = [
          ...movieGenres,
          ...tvGenres.filter(
            (tvGenre) =>
              !movieGenres.some(
                (movieGenre) => movieGenre.name === tvGenre.name
              )
          ),
        ]

        // Create genre map for lookup
        const genreMap = {}
        allGenres.forEach((genre) => {
          genreMap[genre.id] = genre.name
          // Also add lowercase version of genre name as key for case-insensitive search
          genreMap[genre.name.toLowerCase()] = genre.id
        })

        setGenreMap(genreMap)
        setGenreList(allGenres)
      } catch (err) {
        console.error('Error loading genres:', err)
      }
    }

    loadGenres()
  }, [])

  // Load popular movies for default view
  useEffect(() => {
    const loadPopularMovies = async () => {
      if (!searchQuery) {
        setLoadingPopular(true)
        try {
          // Fetch popular movies
          const response = await fetchTrending(
            'movie',
            'day',
            currentPage,
            ITEMS_PER_PAGE
          )

          if (response.results && response.results.length > 0) {
            // Update pagination information
            setTotalPages(
              response.total_pages > 500 ? 500 : response.total_pages
            )
            setTotalResults(response.total_results)

            // Filter only valid content
            const validResults = response.results.filter(isValidContent)

            // Format movie data for display
            const formattedMovies = validResults.map((movie) => ({
              id: movie.id,
              type: 'movie',
              title: movie.title,
              posterPath: movie.poster_path,
              rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
              year: movie.release_date
                ? movie.release_date.substring(0, 4)
                : 'Unknown',
              genre:
                movie.genre_ids && movie.genre_ids.length > 0
                  ? genreMap[movie.genre_ids[0]] || 'Unknown'
                  : 'Unknown',
              description: movie.overview,
            }))

            setPopularMovies(formattedMovies)
          }
        } catch (err) {
          console.error('Error loading popular movies:', err)
        } finally {
          setLoadingPopular(false)
        }
      }
    }

    // Only load popular movies if genreMap is loaded
    if (Object.keys(genreMap).length > 0) {
      loadPopularMovies()
    }
  }, [searchQuery, genreMap, currentPage])

  // Check if the query is a genre name
  const isGenreQuery = useMemo(() => {
    if (!searchQuery || Object.keys(genreMap).length === 0) return false

    const lowerCaseQuery = searchQuery.toLowerCase()
    return Object.keys(genreMap).some((key) => {
      // Check if the key is a string (genre name) and matches the query
      return (
        typeof key === 'string' &&
        !Number.isInteger(parseInt(key)) &&
        key.includes(lowerCaseQuery)
      )
    })
  }, [searchQuery, genreMap])

  // Search function using TMDB API
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setLoading(true)
      setError(null)
      setIsGenreSearch(false)

      try {
        let results = []
        let totalResults = 0
        let totalPages = 0

        // Check if the search query matches any genre names
        const lowerCaseQuery = searchQuery.toLowerCase()
        const matchingGenres = genreList.filter((genre) =>
          genre.name.toLowerCase().includes(lowerCaseQuery)
        )

        if (matchingGenres.length > 0 && isGenreQuery) {
          // If we have a genre match, search by genre
          setIsGenreSearch(true)
          const genreId = matchingGenres[0].id

          // Fetch movies with this genre
          const movieData = await searchByGenre(
            genreId,
            'movie',
            currentPage,
            ITEMS_PER_PAGE / 2
          )
          // Fetch TV shows with this genre
          const tvData = await searchByGenre(
            genreId,
            'tv',
            currentPage,
            ITEMS_PER_PAGE / 2
          )

          // Combine results and add media_type
          const movieResults = movieData.results || []
          const tvResults = tvData.results || []

          // Update pagination information (combining both sets)
          totalResults = Math.max(
            movieData.total_results || 0,
            tvData.total_results || 0
          )
          totalPages = Math.max(
            movieData.total_pages || 0,
            tvData.total_pages || 0
          )

          // Combine and add media_type, then filter for valid content only
          results = [
            ...movieResults.map((item) => ({ ...item, media_type: 'movie' })),
            ...tvResults.map((item) => ({ ...item, media_type: 'tv' })),
          ].filter(isValidContent)
        } else {
          // Regular search with pagination
          const searchData = await searchTMDB(
            searchQuery,
            currentPage,
            ITEMS_PER_PAGE
          )
          // Filter for valid content only
          results = (searchData.results || []).filter(isValidContent)

          // Update pagination information
          totalResults = searchData.total_results || 0
          totalPages = searchData.total_pages || 0
        }

        // Update state with pagination info
        setTotalResults(totalResults)
        setTotalPages(totalPages > 500 ? 500 : totalPages) // TMDB API limits to 500 pages

        // Format search results for our UI
        const formattedResults = results.map((item) => {
          // Different properties based on media type
          let formattedItem = {
            id: item.id,
            type: item.media_type,
            posterPath: item.poster_path || item.profile_path,
            rating: item.vote_average ? item.vote_average.toFixed(1) : null,
          }

          // Add type-specific properties
          if (item.media_type === 'movie') {
            formattedItem = {
              ...formattedItem,
              title: item.title,
              year: item.release_date
                ? item.release_date.substring(0, 4)
                : 'Unknown',
              genre:
                item.genre_ids && item.genre_ids.length > 0
                  ? genreMap[item.genre_ids[0]] || 'Unknown'
                  : 'Unknown',
              description: item.overview,
            }
          } else if (item.media_type === 'tv') {
            formattedItem = {
              ...formattedItem,
              title: item.name,
              year: item.first_air_date
                ? item.first_air_date.substring(0, 4)
                : 'Unknown',
              genre:
                item.genre_ids && item.genre_ids.length > 0
                  ? genreMap[item.genre_ids[0]] || 'Unknown'
                  : 'Unknown',
              description: item.overview,
            }
          } else if (item.media_type === 'person') {
            formattedItem = {
              ...formattedItem,
              title: item.name,
              popularity: item.popularity,
              knownFor: item.known_for_department || 'Acting',
              knownForTitles: item.known_for
                ? item.known_for
                    .filter(isValidContent)
                    .map((work) => work.title || work.name)
                    .join(', ')
                : '',
            }
          }

          return formattedItem
        })

        setSearchResults(formattedResults)
      } catch (err) {
        console.error('Search error:', err)
        setError('Failed to perform search. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    // Only perform search if genreMap is loaded
    if (Object.keys(genreMap).length > 0) {
      performSearch()
    }
  }, [searchQuery, genreMap, currentPage, genreList, isGenreQuery])

  // Filter results based on active tab
  const filteredResults =
    activeTab === 'all'
      ? searchResults
      : searchResults.filter((item) => item.type === activeTab)

  // Handle search input changes
  const handleSearch = (e) => {
    e.preventDefault()
    const searchValue = e.target.search.value.trim()

    if (searchValue) {
      // Reset page when performing a new search
      setCurrentPage(1)
      navigate(`/search?q=${encodeURIComponent(searchValue)}`)
    }
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1) // Go back to the previous page in history
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-8">
        {/* Go Back Button */}
        <div className="mb-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1.5 text-white bg-[#1e1e1e] hover:bg-[#2e2e2e] px-3 py-1.5 rounded-md transition-colors text-sm"
          >
            <span className="text-sm">←</span> Go Back
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search for movies, TV shows, people or genres..."
              className="w-full bg-[#1e1e1e] border border-gray-700 text-white py-2.5 px-4 pr-12 rounded-md focus:outline-none focus:border-[#5ccfee] text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
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
          </div>
        </form>

        {/* Minimalist Genre Bar - core genres only */}
        {!searchQuery && genreList.length > 0 && (
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-center flex-wrap gap-1.5">
              {genreList
                // Filter for only popular/core genres
                .filter(
                  (genre) =>
                    genre.id > 0 &&
                    genre.name &&
                    genre.name.trim() !== '' &&
                    ![
                      'Foreign',
                      'TV Movie',
                      'News',
                      'Documentary',
                      'War',
                      'Western',
                      'History',
                      'Music',
                      'Reality',
                      'Soap',
                      'Talk',
                      'War & Politics',
                    ].includes(genre.name)
                )
                // Sort alphabetically and limit to 12 core genres
                .sort((a, b) => a.name.localeCompare(b.name))
                .slice(0, 12)
                .map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() =>
                      navigate(`/search?q=${encodeURIComponent(genre.name)}`)
                    }
                    className="px-2 py-0.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-400 hover:text-white text-xs rounded transition-colors duration-200"
                  >
                    {genre.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Loading State for Search */}
        {loading && currentPage === 1 && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-400">Searching...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400">
              Please try a different search term or check back later.
            </p>
          </div>
        )}

        {/* Results Area */}
        {!loading && !error && searchResults.length > 0 && (
          <>
            {/* Search Description */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <p className="text-gray-400 text-sm mb-2 sm:mb-0">
                {isGenreSearch ? (
                  <span>
                    {totalResults.toLocaleString()} results for genre "
                    {searchQuery}" • Page {currentPage} of {totalPages}
                  </span>
                ) : (
                  <span>
                    {totalResults.toLocaleString()} results for "{searchQuery}"
                    • Page {currentPage} of {totalPages}
                  </span>
                )}
              </p>

              {/* Filter Tabs */}
              <div className="inline-flex bg-[#1e1e1e] rounded-md p-0.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-md text-xs ${
                    activeTab === 'all'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('movie')}
                  className={`px-3 py-1 rounded-md text-xs ${
                    activeTab === 'movie'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setActiveTab('tv')}
                  className={`px-3 py-1 rounded-md text-xs ${
                    activeTab === 'tv'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  TV Shows
                </button>
                <button
                  onClick={() => setActiveTab('person')}
                  className={`px-3 py-1 rounded-md text-xs ${
                    activeTab === 'person'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  People
                </button>
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

            {/* Results Grid - More compact layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
              {filteredResults.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* No Results */}
        {!loading && !error && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-white mb-2">No results found</p>
            <p className="text-gray-400">
              We couldn't find anything matching "{searchQuery}". Try different
              keywords or check for typos.
            </p>
          </div>
        )}

        {/* Popular Movies - When no search query */}
        {!loading && !searchQuery && (
          <div>
            <h2 className="text-xl text-white mb-4 font-medium">
              Popular Movies
            </h2>

            {/* Loading State for Popular Movies */}
            {loadingPopular && currentPage === 1 && (
              <div className="flex justify-center items-center py-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-400">Loading popular movies...</p>
                </div>
              </div>
            )}

            {/* Loading overlay for page changes */}
            {loadingPopular && currentPage > 1 && (
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

            {/* Popular Movies Result Count */}
            {!loadingPopular && popularMovies.length > 0 && (
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-400 text-xs">
                  {totalResults.toLocaleString()} movies found • Page{' '}
                  {currentPage} of {totalPages}
                </p>
              </div>
            )}

            {/* Popular Movies Grid */}
            {!loadingPopular && popularMovies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
                {popularMovies.map((movie) => (
                  <ResultCard key={`movie-${movie.id}`} item={movie} />
                ))}
              </div>
            )}

            {/* Pagination for Popular Movies */}
            {!loadingPopular && popularMovies.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ item }) {
  // Different card renderings based on media type
  if (item.type === 'person') {
    return (
      <Link
        to={`/person/${item.id}`}
        className="bg-[#1e1e1e] rounded-md overflow-hidden hover:translate-y-[-2px] transition-transform duration-200"
      >
        <div className="flex h-full flex-col">
          <div className="w-full h-24 overflow-hidden">
            <img
              src={
                item.posterPath
                  ? `https://image.tmdb.org/t/p/w185${item.posterPath}`
                  : placeholderImg
              }
              alt={item.title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = placeholderImg
              }}
            />
          </div>
          <div className="p-1.5 flex-1">
            <h3 className="text-white text-xs font-medium mb-0.5 line-clamp-1">
              {item.title}
            </h3>
            <p className="text-[#5ccfee] text-[10px] mb-0.5">{item.knownFor}</p>
            {item.knownForTitles && (
              <p className="text-gray-400 text-[10px] line-clamp-1">
                {item.knownForTitles}
              </p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Movie or TV Show card (more compact)
  return (
    <Link
      to={`/${item.type}/${item.id}`}
      className="bg-[#1e1e1e] rounded-md overflow-hidden hover:translate-y-[-2px] transition-transform duration-200"
    >
      <div className="aspect-[2/3] relative">
        <img
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w185${item.posterPath}`
              : placeholderImg
          }
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = placeholderImg
          }}
        />
        {item.rating && (
          <div className="absolute top-0 right-0 bg-black/60 px-1 py-0.5 m-0.5 rounded text-[10px]">
            <span className="text-[#5ccfee]">{item.rating}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#5ccfee] font-medium truncate max-w-[70%]">
              {item.genre}
            </span>
            <span className="text-[10px] text-gray-300">{item.year}</span>
          </div>
        </div>
      </div>
      <div className="p-1.5">
        <h3 className="text-white text-xs font-medium line-clamp-1">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

export default SearchPage
