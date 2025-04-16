import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Mock data for search results
const mockSearchData = {
  movies: [
    { id: 'movie-1', title: 'The Last Journey', type: 'movie' },
    { id: 'movie-2', title: 'Eternal Sunshine', type: 'movie' },
    { id: 'movie-3', title: 'Dark Knight', type: 'movie' },
    { id: 'movie-4', title: 'Lost in Space', type: 'movie' },
    { id: 'movie-5', title: 'The Great Adventure', type: 'movie' },
    { id: 'movie-6', title: 'Inception', type: 'movie' },
    { id: 'movie-7', title: 'Pulp Fiction', type: 'movie' },
    { id: 'movie-8', title: 'The Godfather', type: 'movie' },
    { id: 'movie-9', title: 'Interstellar', type: 'movie' },
    { id: 'movie-10', title: 'The Matrix', type: 'movie' },
  ],
  shows: [
    { id: 'show-1', title: 'Stranger Things', type: 'tv' },
    { id: 'show-2', title: 'The Crown', type: 'tv' },
    { id: 'show-3', title: 'Breaking Bad', type: 'tv' },
    { id: 'show-4', title: 'The Mandalorian', type: 'tv' },
    { id: 'show-5', title: 'Game of Thrones', type: 'tv' },
    { id: 'show-6', title: 'The Office', type: 'tv' },
    { id: 'show-7', title: 'Black Mirror', type: 'tv' },
    { id: 'show-8', title: 'The Witcher', type: 'tv' },
    { id: 'show-9', title: 'Euphoria', type: 'tv' },
    { id: 'show-10', title: 'The Boys', type: 'tv' },
  ],
  actors: [
    { id: 'actor-1', name: 'Tom Hanks' },
    { id: 'actor-2', name: 'Leonardo DiCaprio' },
    { id: 'actor-3', name: 'Jennifer Lawrence' },
    { id: 'actor-4', name: 'Scarlett Johansson' },
    { id: 'actor-5', name: 'Robert Downey Jr.' },
    { id: 'actor-6', name: 'Meryl Streep' },
    { id: 'actor-7', name: 'Brad Pitt' },
    { id: 'actor-8', name: 'Chadwick Boseman' },
    { id: 'actor-9', name: 'Emma Stone' },
    { id: 'actor-10', name: 'Denzel Washington' },
  ],
  genres: [
    { id: 'genre-1', name: 'Action' },
    { id: 'genre-2', name: 'Drama' },
    { id: 'genre-3', name: 'Comedy' },
    { id: 'genre-4', name: 'Sci-Fi' },
    { id: 'genre-5', name: 'Horror' },
    { id: 'genre-6', name: 'Romance' },
    { id: 'genre-7', name: 'Thriller' },
    { id: 'genre-8', name: 'Fantasy' },
    { id: 'genre-9', name: 'Mystery' },
    { id: 'genre-10', name: 'Adventure' },
  ],
}

function SearchBar({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [results, setResults] = useState({
    movies: [],
    shows: [],
    actors: [],
    genres: [],
  })
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
    }, 300) // 300ms debounce time

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

    const query = debouncedQuery.toLowerCase()

    // Filter mock data based on query
    const filteredResults = {
      movies: mockSearchData.movies
        .filter((movie) => movie.title.toLowerCase().includes(query))
        .slice(0, 5),
      shows: mockSearchData.shows
        .filter((show) => show.title.toLowerCase().includes(query))
        .slice(0, 5),
      actors: mockSearchData.actors
        .filter((actor) => actor.name.toLowerCase().includes(query))
        .slice(0, 5),
      genres: mockSearchData.genres
        .filter((genre) => genre.name.toLowerCase().includes(query))
        .slice(0, 5),
    }

    setResults(filteredResults)
  }, [debouncedQuery])

  // Handle navigation
  const handleResultClick = (item, type) => {
    onClose()

    // Navigate based on result type
    if (type === 'movies' || type === 'shows') {
      // For demo purposes, we'll just log
      console.log(`Navigating to ${type}: ${item.title}`)
      // In a real app: navigate(`/${item.type}/${item.id}`)
    } else if (type === 'actors') {
      // For demo purposes, we'll just log
      console.log(`Navigating to actor: ${item.name}`)
      // In a real app: navigate(`/actor/${item.id}`);
    } else if (type === 'genres') {
      if (item.name === 'TV') {
        // For demo purposes, we'll just log
        console.log(`Navigating to TV shows with genre: ${item.name}`)
        // In a real app: navigate(`/shows?genre=${item.name}`)
      } else {
        // For demo purposes, we'll just log
        console.log(`Navigating to movies with genre: ${item.name}`)
        // In a real app: navigate(`/movies?genre=${item.name}`)
      }
    }
  }

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
              placeholder="Search for movies, TV shows, actors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5ccfee] pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
          ) : !hasResults ? (
            <div className="p-6 text-center text-gray-400">
              No results found for "{debouncedQuery}"
            </div>
          ) : (
            <div className="p-2">
              {/* Movies results */}
              {results.movies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[#5ccfee] text-sm font-medium mb-2 px-2">
                    Movies
                  </h3>
                  <ul>
                    {results.movies.map((movie) => (
                      <li key={movie.id}>
                        <Link
                          to={`/movie/${movie.id}`}
                          onClick={() => handleResultClick(movie, 'movies')}
                          className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2a2a] text-white flex items-center"
                        >
                          <span className="mr-2 text-gray-400">🎬</span>
                          {movie.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TV Shows results */}
              {results.shows.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[#5ccfee] text-sm font-medium mb-2 px-2">
                    TV Shows
                  </h3>
                  <ul>
                    {results.shows.map((show) => (
                      <li key={show.id}>
                        <Link
                          to={`/show/${show.id}`}
                          onClick={() => handleResultClick(show, 'shows')}
                          className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2a2a] text-white flex items-center"
                        >
                          <span className="mr-2 text-gray-400">📺</span>
                          {show.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actors results */}
              {results.actors.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-[#5ccfee] text-sm font-medium mb-2 px-2">
                    Actors
                  </h3>
                  <ul>
                    {results.actors.map((actor) => (
                      <li key={actor.id}>
                        <Link
                          to={`/actor/${actor.id}`}
                          onClick={() => handleResultClick(actor, 'actors')}
                          className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2a2a] text-white flex items-center"
                        >
                          <span className="mr-2 text-gray-400">👤</span>
                          {actor.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Genres results */}
              {results.genres.length > 0 && (
                <div className="mb-2">
                  <h3 className="text-[#5ccfee] text-sm font-medium mb-2 px-2">
                    Genres
                  </h3>
                  <ul>
                    {results.genres.map((genre) => (
                      <li key={genre.id}>
                        <Link
                          to={`/genre/${genre.id}`}
                          onClick={() => handleResultClick(genre, 'genres')}
                          className="w-full text-left px-3 py-2 rounded hover:bg-[#2a2a2a] text-white flex items-center"
                        >
                          <span className="mr-2 text-gray-400">#</span>
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with close button */}
        <div className="p-3 border-t border-[#2a2a2a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
