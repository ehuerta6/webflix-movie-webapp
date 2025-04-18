import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  searchTMDB,
  fetchGenres,
  searchByGenre,
  fetchMovies,
  fetchShows,
  fetchTrending,
} from '../services/api'
import Pagination from '../components/Pagination'
import ResultCard from '../components/ResultCard'

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

  // Featured content states
  const [featured, setFeatured] = useState(null)
  const [featuredItems, setFeaturedItems] = useState([])
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0)
  const carouselTimerRef = useRef(null)

  // Helper function to validate if content has required information
  const isValidContent = useCallback((item) => {
    if (!item) return false

    // Basic requirements for all types
    const hasIdentifier = item.id > 0
    const hasTitle = item.title || item.name
    const hasPoster = !!item.poster_path // Must have a poster

    // Different validations based on media type
    if (item.media_type === 'movie' || (hasTitle && item.title)) {
      // For movies: require title, poster, and overview
      return hasIdentifier && hasTitle && hasPoster && item.overview
    } else if (
      item.media_type === 'tv' ||
      (hasTitle && item.name && !item.title)
    ) {
      // For TV shows: require poster, title, overview and air date
      return (
        hasIdentifier &&
        hasTitle &&
        hasPoster &&
        item.overview &&
        item.overview.trim() !== '' &&
        ((item.first_air_date && item.first_air_date.trim() !== '') ||
          (item.release_date && item.release_date.trim() !== ''))
      )
    } else if (item.media_type === 'person') {
      // For people: need name and profile path
      return hasIdentifier && hasTitle && item.profile_path
    }

    // If media_type is not specified and can't determine the type, use strict validation
    return hasIdentifier && hasTitle && hasPoster && item.overview
  }, [])

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

        // Create a map for quick lookups
        const genreMapping = {}
        allGenres.forEach((genre) => {
          genreMapping[genre.id] = genre.name
        })

        setGenreMap(genreMapping)
        setGenreList(allGenres)
      } catch (err) {
        console.error('Error loading genres:', err)
        setError('Failed to load genres')
      }
    }

    loadGenres()
  }, [])

  // Load popular content when no search is active
  useEffect(() => {
    if (!searchQuery) {
      loadPopularMovies()
      loadFeaturedContent()
    } else {
      performSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage, activeTab])

  // Clean up carousel timer on unmount
  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current)
      }
    }
  }, [])

  const loadPopularMovies = async () => {
    setLoadingPopular(true)
    try {
      let results

      if (activeTab === 'movies') {
        const data = await fetchMovies(
          { sort_by: 'popularity.desc' },
          currentPage
        )
        results = data.results.map((item) => ({ ...item, media_type: 'movie' }))
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      } else if (activeTab === 'tv') {
        const data = await fetchShows(
          { sort_by: 'popularity.desc' },
          currentPage
        )
        results = data.results.map((item) => ({ ...item, media_type: 'tv' }))
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      } else {
        const data = await fetchTrending('all', 'week')
        results = data.results
        setTotalPages(data.total_pages || 1)
        setTotalResults(data.total_results || results.length)
      }

      // Filter out invalid content
      const validResults = results.filter(isValidContent)

      setPopularMovies(validResults)
      setError(null)
    } catch (err) {
      console.error('Error loading popular content:', err)
      setError('Failed to load content. Please try again later.')
      setPopularMovies([])
    } finally {
      setLoadingPopular(false)
    }
  }

  const loadFeaturedContent = async () => {
    try {
      const data = await fetchTrending('all', 'day')

      if (data && data.results && data.results.length > 0) {
        // Filter for valid featured items
        const validFeatured = data.results.filter(isValidContent).slice(0, 5) // Take top 5 trending items

        if (validFeatured.length > 0) {
          setFeaturedItems(validFeatured)
          setFeatured(validFeatured[0])

          // Set up auto-rotation
          if (carouselTimerRef.current) {
            clearInterval(carouselTimerRef.current)
          }

          carouselTimerRef.current = setInterval(() => {
            setCurrentFeaturedIndex((prev) => {
              const nextIndex = (prev + 1) % validFeatured.length
              setFeatured(validFeatured[nextIndex])
              return nextIndex
            })
          }, 8000) // Rotate every 8 seconds
        }
      }
    } catch (err) {
      console.error('Error loading featured content:', err)
    }
  }

  const performSearch = async () => {
    if (!searchQuery && !isGenreSearch) {
      setSearchResults([])
      return
    }

    setLoading(true)
    try {
      let results = []
      let totalPgs = 0
      let totalRes = 0

      // Determine the type of search based on active tab
      let searchType =
        activeTab === 'all' ? 'multi' : activeTab === 'tv' ? 'tv' : 'movie'

      if (isGenreSearch) {
        // Genre search
        const genreId = searchQuery.split('-')[1]
        if (genreId) {
          const mediaType = activeTab === 'tv' ? 'tv' : 'movie'
          const data = await searchByGenre(genreId, mediaType, currentPage)

          results = data.results.map((item) => ({
            ...item,
            media_type: mediaType,
          }))

          totalPgs = data.total_pages
          totalRes = data.total_results
        }
      } else {
        // Text search
        const data = await searchTMDB(searchQuery, currentPage)

        results = data.results.filter((item) => {
          if (activeTab === 'all') return true
          return item.media_type === activeTab
        })

        totalPgs = data.total_pages
        totalRes = data.total_results
      }

      // Filter and format results
      const validResults = results.filter(isValidContent).map(formatMovieData)

      setSearchResults(validResults)
      setTotalPages(totalPgs)
      setTotalResults(totalRes)
      setError(null)
    } catch (err) {
      console.error('Error searching:', err)
      setError('Search failed. Please try again.')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const inputElement = e.target.elements.searchQuery
    const query = inputElement.value.trim()

    if (query) {
      setCurrentPage(1)
      setIsGenreSearch(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const formatMovieData = (movie) => ({
    id: movie.id,
    title: movie.title || movie.name,
    overview: movie.overview,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : null,
    releaseDate: movie.release_date || movie.first_air_date,
    type: movie.media_type === 'tv' ? 'tv' : 'movie',
    genres: movie.genre_ids
      ? movie.genre_ids.map((id) => genreMap[id]).filter(Boolean)
      : [],
    popularity: movie.popularity,
  })

  const changeFeaturedItem = (index) => {
    if (index >= 0 && index < featuredItems.length) {
      setCurrentFeaturedIndex(index)
      setFeatured(featuredItems[index])

      // Reset auto-rotation timer
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current)
      }

      carouselTimerRef.current = setInterval(() => {
        setCurrentFeaturedIndex((prev) => {
          const nextIndex = (prev + 1) % featuredItems.length
          setFeatured(featuredItems[nextIndex])
          return nextIndex
        })
      }, 8000)
    }
  }

  const Featured = ({ movie }) => {
    if (!movie) return null

    const formattedMovie = formatMovieData(movie)

    const goToNext = (e) => {
      e.stopPropagation()
      const nextIndex = (currentFeaturedIndex + 1) % featuredItems.length
      changeFeaturedItem(nextIndex)
    }

    const goToPrev = (e) => {
      e.stopPropagation()
      const prevIndex =
        (currentFeaturedIndex - 1 + featuredItems.length) % featuredItems.length
      changeFeaturedItem(prevIndex)
    }

    return (
      <div className="relative overflow-hidden mb-8 rounded-xl shadow-xl">
        <Link
          to={`/${formattedMovie.type}/${formattedMovie.id}`}
          className="block"
        >
          <div className="aspect-[21/9] relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-80"></div>

            <img
              src={formattedMovie.backdrop}
              alt={formattedMovie.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {formattedMovie.title}
              </h2>

              <div className="flex items-center mb-2">
                {formattedMovie.rating && (
                  <span className="bg-[#5ccfee] text-black px-2 py-0.5 rounded text-sm font-medium mr-3">
                    {formattedMovie.rating}
                  </span>
                )}

                {formattedMovie.releaseDate && (
                  <span className="text-gray-300 text-sm mr-3">
                    {new Date(formattedMovie.releaseDate).getFullYear()}
                  </span>
                )}

                <span className="text-[#5ccfee] font-medium text-sm">
                  {formattedMovie.type === 'tv' ? 'TV Series' : 'Movie'}
                </span>
              </div>

              <p className="text-gray-300 line-clamp-3 md:w-2/3 text-sm md:text-base">
                {formattedMovie.overview}
              </p>
            </div>
          </div>
        </Link>

        {/* Carousel Navigation */}
        {featuredItems.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {featuredItems.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    changeFeaturedItem(index)
                  }}
                  className={`w-2 h-2 rounded-full ${
                    index === currentFeaturedIndex
                      ? 'bg-[#5ccfee]'
                      : 'bg-gray-300/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Filter the results based on activeTab
  const filteredResults = useMemo(() => {
    const results = searchQuery ? searchResults : popularMovies

    if (activeTab === 'all') return results

    return results.filter(
      (item) => item.type === activeTab || item.media_type === activeTab
    )
  }, [searchQuery, searchResults, popularMovies, activeTab])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="mb-4 flex items-center text-gray-400 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            name="searchQuery"
            defaultValue={searchQuery}
            placeholder="Search for movies, TV shows, or people..."
            className="flex-grow p-3 bg-[#1e1e1e] text-white border border-[#2a2a2a] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
          />
          <button
            type="submit"
            className="bg-[#5ccfee] text-black px-6 py-3 rounded-r-md font-medium hover:bg-[#4abfe0] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Featured Content */}
      {!searchQuery && !isGenreSearch && featured && (
        <Featured movie={featured} />
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-[#2a2a2a] mb-6">
        <button
          onClick={() => {
            setActiveTab('all')
            setCurrentPage(1)
          }}
          className={`py-2 px-4 font-medium ${
            activeTab === 'all'
              ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setActiveTab('movie')
            setCurrentPage(1)
          }}
          className={`py-2 px-4 font-medium ${
            activeTab === 'movie'
              ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => {
            setActiveTab('tv')
            setCurrentPage(1)
          }}
          className={`py-2 px-4 font-medium ${
            activeTab === 'tv'
              ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          TV Shows
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Search Results or Popular Content */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-white">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : isGenreSearch
            ? `${genreMap[searchQuery.split('-')[1]] || 'Genre'} ${
                activeTab === 'tv' ? 'TV Shows' : 'Movies'
              }`
            : 'Popular Content'}
          {totalResults > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({totalResults} results)
            </span>
          )}
        </h2>

        {/* Loading state */}
        {(loading || loadingPopular) && (
          <div className="flex justify-center my-20">
            <div className="w-12 h-12 border-4 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* No results state */}
        {!loading && !loadingPopular && filteredResults.length === 0 && (
          <div className="text-center my-20 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl">No results found</p>
            <p className="mt-2">
              Try different keywords or browse popular content
            </p>
          </div>
        )}

        {/* Results grid */}
        {!loading && !loadingPopular && filteredResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredResults.map((item) => (
              <ResultCard key={`${item.type}-${item.id}`} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
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

export default SearchPage
