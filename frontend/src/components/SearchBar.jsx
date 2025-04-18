import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { searchTMDB } from '../services/api'

function SearchBar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState({
    movies: [],
    shows: [],
    actors: [],
    genres: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Focus the input when opened
  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('search-input')
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [isOpen])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  // Search functionality
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({
        movies: [],
        shows: [],
        actors: [],
        genres: [],
      })
      return
    }

    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const data = await searchTMDB(debouncedQuery)

        // Organize results by type
        const movies = []
        const shows = []
        const actors = []

        data.results.forEach((item) => {
          if (item.media_type === 'movie') {
            movies.push({
              id: item.id,
              title: item.title,
              type: 'movie',
            })
          } else if (item.media_type === 'tv') {
            shows.push({
              id: item.id,
              title: item.name,
              type: 'tv',
            })
          } else if (item.media_type === 'person') {
            actors.push({
              id: item.id,
              name: item.name,
            })
          }
        })

        setResults({
          movies: movies.slice(0, 5),
          shows: shows.slice(0, 5),
          actors: actors.slice(0, 5),
          genres: [], // We'll handle genres separately if needed
        })
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  // Check if there are any results
  const hasResults = Object.values(results).some(
    (category) => category.length > 0
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20">
      <div
        ref={searchRef}
        className="bg-[#121212] rounded-md shadow-lg w-full max-w-2xl mx-4"
      >
        {/* Search input */}
        <div className="p-4 border-b border-[#2a2a2a]">
          <div className="relative">
            <input
              id="search-input"
              type="text"
              placeholder="Search for movies, TV shows, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee] pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {debouncedQuery.length < 2 ? (
            <div className="p-6 text-center text-gray-400">
              Start typing to search (minimum 2 characters)
            </div>
          ) : isLoading ? (
            <div className="p-6 text-center">
              <div className="inline-block w-6 h-6 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-gray-400">
              No results found for "{debouncedQuery}"
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {/* Movies */}
              {results.movies.length > 0 && (
                <div className="p-4">
                  <h3 className="text-[#5ccfee] font-medium mb-2">Movies</h3>
                  <ul className="space-y-2">
                    {results.movies.map((movie) => (
                      <li key={movie.id}>
                        <Link
                          to={`/movie/${movie.id}`}
                          className="block p-2 hover:bg-[#1e1e1e] rounded transition-colors"
                          onClick={onClose}
                        >
                          {movie.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TV Shows */}
              {results.shows.length > 0 && (
                <div className="p-4">
                  <h3 className="text-[#5ccfee] font-medium mb-2">TV Shows</h3>
                  <ul className="space-y-2">
                    {results.shows.map((show) => (
                      <li key={show.id}>
                        <Link
                          to={`/tv/${show.id}`}
                          className="block p-2 hover:bg-[#1e1e1e] rounded transition-colors"
                          onClick={onClose}
                        >
                          {show.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actors */}
              {results.actors.length > 0 && (
                <div className="p-4">
                  <h3 className="text-[#5ccfee] font-medium mb-2">People</h3>
                  <ul className="space-y-2">
                    {results.actors.map((actor) => (
                      <li key={actor.id}>
                        <Link
                          to={`/person/${actor.id}`}
                          className="block p-2 hover:bg-[#1e1e1e] rounded transition-colors"
                          onClick={onClose}
                        >
                          {actor.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with search all button */}
        {hasResults && (
          <div className="p-4 border-t border-[#2a2a2a]">
            <Link
              to={`/search?query=${encodeURIComponent(debouncedQuery)}`}
              className="block w-full py-2 px-4 bg-[#5ccfee] text-black font-medium rounded text-center hover:bg-[#4abfe0] transition-colors"
              onClick={onClose}
            >
              View all results
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
