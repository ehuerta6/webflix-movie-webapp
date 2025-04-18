import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'
import { searchTMDB, fetchGenres } from '../services/api'

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

  // Load genres for proper display
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await fetchGenres()
        const genreMap = {}
        genres.forEach((genre) => {
          genreMap[genre.id] = genre.name
        })
        setGenreMap(genreMap)
      } catch (err) {
        console.error('Error loading genres:', err)
      }
    }

    loadGenres()
  }, [])

  // Search function using TMDB API
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const results = await searchTMDB(searchQuery)

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

    performSearch()
  }, [searchQuery, genreMap])

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
      navigate(`/search?q=${encodeURIComponent(searchValue)}`)
    }
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search for movies, TV shows, or people..."
              className="w-full bg-[#1e1e1e] border border-gray-700 text-white py-3 px-4 pr-12 rounded-md focus:outline-none focus:border-[#5ccfee]"
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
        {loading && (
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
            {/* Filter Tabs */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-[#1e1e1e] rounded-md p-1">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'all'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('movie')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'movie'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setActiveTab('tv')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'tv'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  TV Shows
                </button>
                <button
                  onClick={() => setActiveTab('person')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'person'
                      ? 'bg-[#5ccfee] text-black font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  People
                </button>
              </div>
            </div>

            {/* Results Count */}
            <p className="text-gray-400 mb-6 text-center">
              Found {filteredResults.length} results for "{searchQuery}"
            </p>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((item) => (
                <ResultCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
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
              Search for movies, TV shows, actors and more
            </p>
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
        <div className="flex h-full">
          <div className="w-1/3">
            <div className="h-full">
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
            </div>
          </div>
          <div className="w-2/3 p-4">
            <h3 className="text-white font-medium mb-1">{item.title}</h3>
            <p className="text-[#5ccfee] text-sm mb-2">{item.knownFor}</p>
            {item.knownForTitles && (
              <p className="text-gray-400 text-sm line-clamp-2">
                Known for: {item.knownForTitles}
              </p>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Movie or TV Show card
  return (
    <Link
      to={`/${item.type}/${item.id}`}
      className="bg-[#1e1e1e] rounded-md overflow-hidden hover:translate-y-[-4px] transition-transform duration-200"
    >
      <div className="aspect-[2/3] relative">
        <img
          src={
            item.posterPath
              ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
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
          <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
            <span className="text-[#5ccfee]">{item.rating}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5ccfee] font-medium">
              {item.genre}
            </span>
            <span className="text-xs text-gray-300">{item.year}</span>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-white font-medium mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
      </div>
    </Link>
  )
}

export default SearchPage
