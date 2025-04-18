import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'
import {
  searchTMDB,
  fetchGenres,
  searchByGenre,
  fetchMovies,
  fetchShows,
} from '../services/api'

function SearchPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''

  const [searchResults, setSearchResults] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [genreMap, setGenreMap] = useState({})
  const [genreList, setGenreList] = useState([])
  const [isGenreSearch, setIsGenreSearch] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

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
          const movieResults = await searchByGenre(genreId, 'movie')
          // Fetch TV shows with this genre
          const tvResults = await searchByGenre(genreId, 'tv')

          // Combine and add media_type
          results = [
            ...movieResults.map((item) => ({ ...item, media_type: 'movie' })),
            ...tvResults.map((item) => ({ ...item, media_type: 'tv' })),
          ]

          // Set if we have more results than shown
          setHasMore(movieResults.length + tvResults.length >= 40)
        } else {
          // Regular search
          results = await searchTMDB(searchQuery, page)
          setHasMore(results.length >= 20)
        }

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
  }, [searchQuery, genreMap, page, genreList, isGenreQuery])

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
      setPage(1)
      navigate(`/search?q=${encodeURIComponent(searchValue)}`)
    }
  }

  // Load more results
  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-8">
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

        {/* Loading State */}
        {loading && page === 1 && (
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
                    Showing {filteredResults.length} results for genre "
                    {searchQuery}"
                  </span>
                ) : (
                  <span>
                    Found {filteredResults.length} results for "{searchQuery}"
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

            {/* Results Grid - More compact layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filteredResults.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-gray-700 text-white rounded-md focus:outline-none text-sm transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
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

        {/* Initial State - No Search Yet */}
        {!loading && !searchQuery && (
          <div className="text-center py-20">
            <p className="text-xl text-white mb-2">
              What are you looking for today?
            </p>
            <p className="text-gray-400">
              Search for movies, TV shows, actors or genres
            </p>

            {/* Genre suggestions for quick access */}
            {genreList.length > 0 && (
              <div className="mt-6">
                <p className="text-gray-400 mb-3 text-sm">Popular genres:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {genreList.slice(0, 12).map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() =>
                        navigate(`/search?q=${encodeURIComponent(genre.name)}`)
                      }
                      className="px-3 py-1 bg-[#1e1e1e] hover:bg-[#2e2e2e] text-gray-300 text-xs rounded-full border border-gray-700"
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
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
        className="bg-[#1e1e1e] rounded-md overflow-hidden hover:translate-y-[-4px] transition-transform duration-200"
      >
        <div className="flex h-full flex-col">
          <div className="w-full h-28 overflow-hidden">
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
          <div className="p-2 flex-1">
            <h3 className="text-white text-sm font-medium mb-0.5 line-clamp-1">
              {item.title}
            </h3>
            <p className="text-[#5ccfee] text-xs mb-1">{item.knownFor}</p>
            {item.knownForTitles && (
              <p className="text-gray-400 text-xs line-clamp-1">
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
      className="bg-[#1e1e1e] rounded-md overflow-hidden hover:translate-y-[-4px] transition-transform duration-200"
    >
      <div className="aspect-[2/3] relative">
        <img
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
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
          <div className="absolute top-0 right-0 bg-black/60 px-1 py-0.5 m-1 rounded text-xs">
            <span className="text-[#5ccfee]">{item.rating}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5ccfee] font-medium truncate max-w-[70%]">
              {item.genre}
            </span>
            <span className="text-xs text-gray-300">{item.year}</span>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-white text-sm font-medium line-clamp-1">
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

export default SearchPage
