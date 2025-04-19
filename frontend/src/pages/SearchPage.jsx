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
  const [searchInput, setSearchInput] = useState(searchQuery)

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

  // Format movie data for consistent display
  const formatMovieData = (movie) => ({
    id: movie.id,
    type: movie.media_type || (movie.first_air_date ? 'tv' : 'movie'),
    title: movie.title || movie.name,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    genre:
      movie.genre_ids && movie.genre_ids.length > 0
        ? genreMap[movie.genre_ids[0]] || 'Unknown'
        : 'Unknown',
    year:
      movie.release_date || movie.first_air_date
        ? (movie.release_date || movie.first_air_date).substring(0, 4)
        : 'Unknown',
    description: movie.overview,
  })

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
      const formattedResults = validResults.map(formatMovieData)

      setPopularMovies(formattedResults)
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
        const validFeatured = data.results
          .filter((item) => isValidContent(item) && item.backdrop_path)
          .slice(0, 5) // Take top 5 trending items

        if (validFeatured.length > 0) {
          const formattedFeatured = validFeatured.map(formatMovieData)
          setFeaturedItems(formattedFeatured)
          setFeatured(formattedFeatured[0])

          // Set up auto-rotation
          if (carouselTimerRef.current) {
            clearInterval(carouselTimerRef.current)
          }

          carouselTimerRef.current = setInterval(() => {
            setCurrentFeaturedIndex((prev) => {
              const nextIndex = (prev + 1) % formattedFeatured.length
              setFeatured(formattedFeatured[nextIndex])
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
      let searchType = activeTab === 'all' ? 'multi' : activeTab

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

      // Filter out invalid content
      const validResults = results.filter(isValidContent)
      const formattedResults = validResults.map(formatMovieData)

      setSearchResults(formattedResults)
      setTotalPages(totalPgs)
      setTotalResults(totalRes)
      setError(null)
    } catch (err) {
      console.error('Error searching:', err)
      setError('Failed to perform search. Please try again later.')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Function to handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`)
      setCurrentPage(1)
    }
  }

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo(0, 0)
  }

  // Display either search results or popular content
  const displayedContent = searchQuery ? searchResults : popularMovies

  // Featured component for the hero section
  const Featured = ({ movie }) => {
    if (!movie || !movie.backdrop) return null

    const [backdropLoaded, setBackdropLoaded] = useState(false)

    // Function to go to the next item
    const goToNext = (e) => {
      e.preventDefault()
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1
      )

      // Reset timer
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current)
        carouselTimerRef.current = setInterval(() => {
          setCurrentFeaturedIndex((prev) => {
            const nextIndex = (prev + 1) % featuredItems.length
            setFeatured(featuredItems[nextIndex])
            return nextIndex
          })
        }, 8000)
      }
    }

    // Function to go to the previous item
    const goToPrev = (e) => {
      e.preventDefault()
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === 0 ? featuredItems.length - 1 : prevIndex - 1
      )

      // Reset timer
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current)
        carouselTimerRef.current = setInterval(() => {
          setCurrentFeaturedIndex((prev) => {
            const nextIndex = (prev + 1) % featuredItems.length
            setFeatured(featuredItems[nextIndex])
            return nextIndex
          })
        }, 8000)
      }
    }

    return (
      <section className="relative mb-10">
        <div className="w-full h-[400px] md:h-[550px] lg:h-[600px] relative overflow-hidden">
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 via-transparent to-[#121212]/80 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#12121280] to-transparent z-10"></div>

          {/* Loading state */}
          {!backdropLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center z-5">
              <div className="w-10 h-10 border-3 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Background image with animation */}
          <div
            className="w-full h-full"
            style={{
              opacity: 1,
              transition:
                'opacity 600ms ease-in-out, transform 800ms ease-in-out',
              position: 'relative',
            }}
          >
            <img
              key={movie.id} // Key helps React identify when to animate
              src={movie.backdrop}
              alt={movie.title}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                backdropLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: 'scale(1.05)',
                animation: backdropLoaded
                  ? 'fadeIn 800ms ease-in-out forwards'
                  : 'none',
              }}
              onLoad={() => setBackdropLoaded(true)}
              fetchPriority="high"
            />
          </div>

          {/* Content overlay with animation */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20">
            <div
              className="max-w-4xl mx-auto w-full"
              style={{
                opacity: 1,
                transition:
                  'opacity 600ms ease-in-out, transform 800ms ease-in-out',
              }}
            >
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <span className="bg-[#5ccfee] text-black font-bold px-2 py-1 rounded mr-3">
                  {movie.rating}
                </span>
                <span className="text-gray-300 text-sm">{movie.year}</span>
                {movie.genre && (
                  <span className="ml-2 px-2 py-1 bg-[#2a2a2a] rounded text-sm">
                    {movie.genre}
                  </span>
                )}
              </div>

              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-2"
                key={`title-${movie.id}`}
                style={{
                  animation: 'slideUp 600ms ease-out forwards',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {movie.title}
              </h1>

              <p
                className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mb-4 line-clamp-3 md:line-clamp-none"
                key={`desc-${movie.id}`}
                style={{
                  animation: 'slideUp 700ms ease-out forwards',
                  animationDelay: '100ms',
                  opacity: 0,
                }}
              >
                {movie.description}
              </p>

              <div
                className="flex gap-3 mt-4"
                key={`buttons-${movie.id}`}
                style={{
                  animation: 'slideUp 800ms ease-out forwards',
                  animationDelay: '200ms',
                  opacity: 0,
                }}
              >
                <Link
                  to={`/${movie.type}/${movie.id}`}
                  className="inline-block bg-[#5ccfee] text-black font-medium px-5 py-2 rounded hover:bg-[#4abfe0] transition-colors mr-3 flex items-center gap-1 group"
                >
                  <span className="transform transition-transform group-hover:scale-110">
                    ▶
                  </span>{' '}
                  Watch
                </Link>
                <button className="inline-block bg-transparent border border-white text-white px-5 py-2 rounded hover:bg-[#5ccfee20] transition-colors flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add to List
                </button>
              </div>

              {/* Carousel indicators */}
              {featuredItems.length > 1 && (
                <div
                  className="flex mt-6 gap-2"
                  style={{
                    animation: 'fadeIn 1s ease-out forwards',
                    animationDelay: '300ms',
                    opacity: 0,
                  }}
                >
                  {featuredItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentFeaturedIndex(index)
                        setFeatured(featuredItems[index])

                        // Reset timer when manually selecting
                        if (carouselTimerRef.current) {
                          clearInterval(carouselTimerRef.current)
                          carouselTimerRef.current = setInterval(() => {
                            setCurrentFeaturedIndex((prev) => {
                              const nextIndex =
                                (prev + 1) % featuredItems.length
                              setFeatured(featuredItems[nextIndex])
                              return nextIndex
                            })
                          }, 8000)
                        }
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentFeaturedIndex
                          ? 'bg-[#5ccfee] w-5'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-label={`View featured item ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation arrows */}
          {featuredItems.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full focus:outline-none transition-all duration-200 hover:scale-110"
                aria-label="Previous featured item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
                className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full focus:outline-none transition-all duration-200 hover:scale-110"
                aria-label="Next featured item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-10">
      {/* New prominently featured search bar at the top */}
      <div className="w-full px-4 py-8 bg-[#1a1a1a] border-b border-[#2a2a2a] mb-8">
        <form onSubmit={handleSearchSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies, TV shows, people..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-5 py-4 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-[#5ccfee] pr-12"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5ccfee] hover:text-white p-2"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
      </div>

      {/* Rest of the component */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Featured banner if no search is active */}
        {!searchQuery && featured && <Featured movie={featured} />}

        {/* Content tabs */}
        <div className="mb-6 border-b border-[#2a2a2a]">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'all'
                  ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                setActiveTab('all')
                setCurrentPage(1)
              }}
            >
              All Content
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'movies'
                  ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                setActiveTab('movies')
                setCurrentPage(1)
              }}
            >
              Movies
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'tv'
                  ? 'text-[#5ccfee] border-b-2 border-[#5ccfee]'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => {
                setActiveTab('tv')
                setCurrentPage(1)
              }}
            >
              TV Shows
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div>
          {/* Title and count */}
          {searchQuery ? (
            <h2 className="text-2xl font-bold mb-4">
              {searchResults.length > 0
                ? `Results for "${searchQuery}" (${totalResults})`
                : `No results found for "${searchQuery}"`}
            </h2>
          ) : (
            <h2 className="text-2xl font-bold mb-4">
              {activeTab === 'all'
                ? 'Trending Content'
                : activeTab === 'movies'
                ? 'Popular Movies'
                : 'Popular TV Shows'}
            </h2>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-4 bg-red-800/50 text-white rounded-md">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {(loading || loadingPopular) && (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Content grid */}
          {!loading && !loadingPopular && displayedContent.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {displayedContent.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} result={item} />
              ))}
            </div>
          )}

          {/* No results message */}
          {!loading &&
            !loadingPopular &&
            displayedContent.length === 0 &&
            !error && (
              <div className="text-center py-12 text-gray-400">
                {searchQuery
                  ? 'No results found. Try a different search term or filter.'
                  : 'No content available. Try a different category.'}
              </div>
            )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
