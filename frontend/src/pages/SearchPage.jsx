import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import placeholder from '../assets/movie-placeholder.png'
import {
  searchTMDB,
  fetchGenres,
  searchByGenre,
  fetchMovies,
  fetchShows,
  fetchTrending,
} from '../services/api'

// Extracted components
const SearchInput = ({ query, onSearch, onInputChange }) => (
  <form onSubmit={onSearch} className="w-full max-w-xl mx-auto mb-5">
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={onInputChange}
        placeholder="Search for movies, TV shows, or people..."
        className="w-full bg-[#252525] text-white px-4 py-2 pr-12 rounded-lg border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee] text-sm"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-400"
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
)

const TabButton = ({ active, label, count, onClick }) => (
  <button
    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      active
        ? 'border-[#5ccfee] text-[#5ccfee]'
        : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
    }`}
    onClick={onClick}
  >
    {label} {count > 0 && <span className="ml-1 text-xs">({count})</span>}
  </button>
)

const GenreCard = ({ genre, handleSelectGenre }) => (
  <div
    onClick={() => handleSelectGenre(genre.id, genre.name)}
    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
  >
    <div className="bg-[#252525] rounded-lg p-3 cursor-pointer border border-[#333] hover:bg-[#303030] transition-colors h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">{genre.name}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-[#5ccfee]"
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
      </div>
    </div>
  </div>
)

const ResultCard = ({ item, mediaType, genreMap }) => {
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()

  const handleImageError = () => {
    setImageError(true)
  }

  const handleCardClick = () => {
    if (mediaType === 'person') {
      navigate(`/person/${item.id}`)
    } else {
      navigate(`/details/${mediaType}/${item.id}`)
    }
  }

  // Format release date or first air date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.getFullYear()
  }

  // Get poster path or profile path with fallback
  const getImageUrl = () => {
    if (imageError) return placeholder

    if (mediaType === 'person') {
      return item.profile_path
        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
        : placeholder
    } else {
      return item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : placeholder
    }
  }

  // Get title based on media type
  const getTitle = () => {
    if (mediaType === 'movie') return item.title
    if (mediaType === 'tv') return item.name
    return item.name
  }

  // Render different card layout based on media type
  if (mediaType === 'person') {
    return (
      <div className="w-full">
        <div
          onClick={handleCardClick}
          className="bg-[#252525] rounded-lg overflow-hidden cursor-pointer hover:bg-[#303030] transition-colors h-full shadow-sm"
        >
          <div className="relative pb-[150%]">
            <img
              src={getImageUrl()}
              alt={item.name}
              onError={handleImageError}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="p-3">
            <h3 className="text-white font-semibold mb-1 truncate">
              {item.name}
            </h3>
            <p className="text-gray-400 text-sm truncate">
              {item.known_for_department || 'Actor'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const releaseYear = formatDate(
    mediaType === 'movie' ? item.release_date : item.first_air_date
  )

  // Get genre names from genre IDs
  const getGenres = () => {
    if (!item.genre_ids || !genreMap) return []
    return item.genre_ids
      .slice(0, 2)
      .map((id) => genreMap[id])
      .filter(Boolean)
  }

  return (
    <div className="w-full">
      <div
        onClick={handleCardClick}
        className="bg-[#252525] rounded-lg overflow-hidden cursor-pointer hover:bg-[#303030] transition-colors h-full flex flex-col shadow-sm"
      >
        <div className="relative pb-[150%]">
          <img
            src={getImageUrl()}
            alt={getTitle()}
            onError={handleImageError}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-[#5ccfee] text-xs font-bold px-1.5 py-0.5 rounded">
              {item.vote_average.toFixed(1)}
            </div>
          )}
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-white font-semibold mb-1 truncate">
            {getTitle()}
          </h3>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-sm">{releaseYear}</span>
            <span className="text-[#5ccfee] text-xs uppercase bg-[#5ccfee10] px-2 py-0.5 rounded">
              {mediaType === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
          {getGenres().length > 0 && (
            <div className="mt-auto pt-1">
              <div className="flex flex-wrap gap-1">
                {getGenres().map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-1.5 py-0.5 bg-[#5ccfee20] text-white rounded-md"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const NoResults = ({ query }) => (
  <div className="text-center py-10">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 text-gray-500 mx-auto mb-3"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <h3 className="text-xl text-white font-semibold mb-1">
      No results found for "{query}"
    </h3>
    <p className="text-gray-400">
      Try adjusting your search or filter to find what you're looking for.
    </p>
  </div>
)

// Minimal genre chip for selection
const GenreChip = ({ genre, handleSelectGenre }) => (
  <button
    onClick={() => handleSelectGenre(genre.id, genre.name)}
    className="px-2.5 py-1 bg-[#1e1e1e] text-xs text-gray-300 hover:text-white border border-[#333] rounded-md 
               hover:bg-[#303030] transition-colors whitespace-nowrap"
  >
    {genre.name}
  </button>
)

// Compact genre section component
const GenreSection = ({ genres, loading, handleSelectGenre }) => {
  // Filter to only show popular genres
  const popularGenres = genres.filter((genre) =>
    [
      'Action',
      'Adventure',
      'Animation',
      'Comedy',
      'Crime',
      'Drama',
      'Family',
      'Fantasy',
      'Horror',
      'Mystery',
      'Romance',
      'Science Fiction',
      'Thriller',
    ].includes(genre.name)
  )

  return (
    <div className="mb-4 overflow-x-auto max-w-xl mx-auto">
      <div className="flex justify-center gap-2 items-center pb-1">
        {loading ? (
          <div className="flex items-center text-gray-400 py-1">
            <div className="animate-spin h-4 w-4 border-b border-[#5ccfee] rounded-full mr-2"></div>
            Loading genres...
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-1.5">
              {popularGenres.map((genre) => (
                <GenreChip
                  key={genre.id}
                  genre={genre}
                  handleSelectGenre={handleSelectGenre}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryParam = searchParams.get('query') || ''

  // State
  const [query, setQuery] = useState(queryParam)
  const [results, setResults] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularShows, setPopularShows] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState({
    search: false,
    popular: false,
    genres: false,
  })
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [genreMap, setGenreMap] = useState({})
  const [genres, setGenres] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Derived state for filtered results
  const movieResults = results.filter((item) => item.media_type === 'movie')
  const tvResults = results.filter((item) => item.media_type === 'tv')
  const personResults = results.filter((item) => item.media_type === 'person')

  // Get current results based on active tab
  const getCurrentResults = () => {
    switch (activeTab) {
      case 'movies':
        return movieResults
      case 'tv':
        return tvResults
      case 'people':
        return personResults
      default:
        return results
    }
  }

  // Helper function to validate media items
  const isValidMedia = (item) => {
    return (
      item &&
      item.id &&
      (item.title || item.name) &&
      item.poster_path &&
      item.vote_average !== undefined
    )
  }

  // Format media for display consistency
  const formatMediaItem = (item, type) => {
    return {
      ...item,
      media_type:
        type || item.media_type || (item.first_air_date ? 'tv' : 'movie'),
    }
  }

  // Load genres for mapping IDs to names
  const loadGenres = useCallback(async () => {
    setLoading((prev) => ({ ...prev, genres: true }))
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        fetchGenres('movie'),
        fetchGenres('tv'),
      ])

      // Create combined genre map
      const genreMapping = {}

      // Add movie genres to the map
      movieGenres.forEach((genre) => {
        genreMapping[genre.id] = genre.name
      })

      // Add TV genres to the map (some might overlap with movies)
      tvGenres.forEach((genre) => {
        genreMapping[genre.id] = genre.name
      })

      setGenreMap(genreMapping)

      // Filter out duplicate genres and uncommon/specialty genres
      const uniqueGenres = [...movieGenres, ...tvGenres]
        .filter(
          (genre, index, self) =>
            index === self.findIndex((g) => g.name === genre.name)
        )
        .filter(
          (genre) =>
            !['News', 'Reality', 'Soap', 'Talk', 'War & Politics'].includes(
              genre.name
            )
        )
        .sort((a, b) => a.name.localeCompare(b.name))

      setGenres(uniqueGenres)
    } catch (error) {
      console.error('Error loading genres:', error)
      setError('Failed to load genres. Please try again later.')
    } finally {
      setLoading((prev) => ({ ...prev, genres: false }))
    }
  }, [])

  // Load popular and top-rated content
  const loadDefaultContent = useCallback(async () => {
    if (Object.keys(genreMap).length === 0) return

    setLoading((prev) => ({ ...prev, popular: true }))
    try {
      // Fetch trending movies, shows, and top-rated movies in parallel
      const [trendingMovies, trendingShows, bestMovies] = await Promise.all([
        fetchTrending('movie', 'week'),
        fetchTrending('tv', 'week'),
        fetchMovies({ sort_by: 'vote_average.desc', 'vote_count.gte': 2000 }),
      ])

      // Format and set popular movies
      setPopularMovies(
        trendingMovies.results
          .filter(isValidMedia)
          .map((item) => formatMediaItem(item, 'movie'))
          .slice(0, 10)
      )

      // Format and set popular TV shows
      setPopularShows(
        trendingShows.results
          .filter(isValidMedia)
          .map((item) => formatMediaItem(item, 'tv'))
          .slice(0, 10)
      )

      // Format and set top-rated movies
      setTopRatedMovies(
        bestMovies.results
          .filter(isValidMedia)
          .map((item) => formatMediaItem(item, 'movie'))
          .slice(0, 10)
      )
    } catch (error) {
      console.error('Error loading default content:', error)
    } finally {
      setLoading((prev) => ({ ...prev, popular: false }))
    }
  }, [genreMap])

  // Perform search with current query
  const performSearch = useCallback(
    async (searchQuery, pageNum = 1, isLoadMore = false) => {
      if (!searchQuery.trim()) {
        setResults([])
        setTotalResults(0)
        return
      }

      setLoading((prev) => ({ ...prev, search: true }))
      setError(null)

      try {
        const data = await searchTMDB(searchQuery, pageNum)

        if (isLoadMore) {
          setResults((prev) => [...prev, ...data.results])
        } else {
          setResults(data.results)
        }

        setTotalResults(data.total_results)
        setHasMore(data.page < data.total_pages)
      } catch (error) {
        console.error('Search error:', error)
        setError('An error occurred while searching. Please try again.')
      } finally {
        setLoading((prev) => ({ ...prev, search: false }))
      }
    },
    []
  )

  // Update search parameters and perform search
  const handleSearch = (e) => {
    e?.preventDefault()

    if (query.trim()) {
      setSearchParams({ query: query.trim() })
      setActiveTab('all')
      setPage(1)
      performSearch(query.trim(), 1, false)
    }
  }

  // Load more results
  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    performSearch(query, nextPage, true)
  }

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value)
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Handle genre selection
  const handleSelectGenre = (genreId, genreName) => {
    navigate(`/movies?genre=${genreId}&name=${genreName}`)
  }

  // Initial load
  useEffect(() => {
    loadGenres()
  }, [loadGenres])

  // Load default content when genres are loaded
  useEffect(() => {
    loadDefaultContent()
  }, [loadDefaultContent])

  // Perform search when query param changes
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam)
      setPage(1)
      performSearch(queryParam, 1, false)
    }
  }, [queryParam, performSearch])

  // Render content section with title
  const renderContentSection = (title, items, type = null) => (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {type && (
          <Link
            to={type === 'tv' ? '/shows' : '/movies'}
            className="text-sm text-[#5ccfee] hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      {loading.popular && items.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-full">
              <div className="bg-[#1e1e1e] animate-pulse rounded-lg overflow-hidden">
                <div className="w-full pb-[150%]"></div>
                <div className="p-3">
                  <div className="h-4 bg-[#2a2a2a] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#2a2a2a] rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <ResultCard
              key={`${type || item.media_type}-${item.id}`}
              item={item}
              mediaType={type || item.media_type}
              genreMap={genreMap}
            />
          ))}
        </div>
      )}
    </section>
  )

  return (
    <div className="min-h-screen bg-[#121212] text-white py-4 px-3">
      <div className="max-w-6xl mx-auto">
        {/* Search Input */}
        <SearchInput
          query={query}
          onSearch={handleSearch}
          onInputChange={handleInputChange}
        />

        {/* Minimal Genre Selector */}
        {!queryParam && (
          <GenreSection
            genres={genres}
            loading={loading.genres}
            handleSelectGenre={handleSelectGenre}
          />
        )}

        {/* Display search results if we have a query */}
        {queryParam ? (
          <>
            {loading.search && results.length === 0 ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5ccfee]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">{error}</div>
            ) : results.length > 0 ? (
              <div>
                <div className="mb-5">
                  <h2 className="text-xl font-bold mb-4">
                    Search Results for "{queryParam}"
                  </h2>

                  {/* Tabs */}
                  <div className="border-b border-[#333] flex mb-4 overflow-x-auto pb-1">
                    <TabButton
                      active={activeTab === 'all'}
                      label="All"
                      count={totalResults}
                      onClick={() => handleTabChange('all')}
                    />
                    <TabButton
                      active={activeTab === 'movies'}
                      label="Movies"
                      count={movieResults.length}
                      onClick={() => handleTabChange('movies')}
                    />
                    <TabButton
                      active={activeTab === 'tv'}
                      label="TV Shows"
                      count={tvResults.length}
                      onClick={() => handleTabChange('tv')}
                    />
                    <TabButton
                      active={activeTab === 'people'}
                      label="People"
                      count={personResults.length}
                      onClick={() => handleTabChange('people')}
                    />
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {getCurrentResults().map((item) => (
                    <ResultCard
                      key={`${item.id}-${item.media_type}`}
                      item={item}
                      mediaType={item.media_type}
                      genreMap={genreMap}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading.search}
                      className="px-6 py-2 bg-[#1e1e1e] hover:bg-[#333] text-white rounded-md"
                    >
                      {loading.search ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NoResults query={queryParam} />
            )}
          </>
        ) : (
          // Default homepage content with popular movies and shows
          <div>
            {/* Featured/Hero Section */}
            {!loading.popular && popularMovies.length > 0 && (
              <div className="mb-8">
                <div className="relative rounded-lg overflow-hidden">
                  <div className="aspect-[21/9] md:aspect-[3/1] relative">
                    <img
                      src={
                        popularMovies[0].backdrop_path
                          ? `https://image.tmdb.org/t/p/original${popularMovies[0].backdrop_path}`
                          : `https://image.tmdb.org/t/p/w780${popularMovies[0].poster_path}`
                      }
                      alt={popularMovies[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#12121280] to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
                      {popularMovies[0].title}
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base mb-3 line-clamp-2 md:w-2/3">
                      {popularMovies[0].overview}
                    </p>
                    <button
                      onClick={() =>
                        navigate(`/details/movie/${popularMovies[0].id}`)
                      }
                      className="px-4 py-2 bg-[#5ccfee] text-black rounded font-medium hover:bg-[#4ab3d3] transition-colors"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {renderContentSection('Trending Movies This Week', popularMovies)}
            {renderContentSection('Trending TV Shows', popularShows, 'tv')}
            {renderContentSection('Top Rated Movies', topRatedMovies)}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage
