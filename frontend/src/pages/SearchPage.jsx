import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Mock data for initial display and search
const mockData = {
  movies: [
    {
      id: 'movie-1',
      title: 'The Last Journey',
      type: 'movie',
      genre: 'Adventure',
      image: 'https://via.placeholder.com/300x450?text=The+Last+Journey',
      year: 2023,
    },
    {
      id: 'movie-2',
      title: 'Eternal Sunshine',
      type: 'movie',
      genre: 'Drama',
      image: 'https://via.placeholder.com/300x450?text=Eternal+Sunshine',
      year: 2022,
    },
    {
      id: 'movie-3',
      title: 'Dark Knight',
      type: 'movie',
      genre: 'Action',
      image: 'https://via.placeholder.com/300x450?text=Dark+Knight',
      year: 2021,
    },
    {
      id: 'movie-4',
      title: 'Lost in Space',
      type: 'movie',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=Lost+in+Space',
      year: 2023,
    },
    {
      id: 'movie-5',
      title: 'The Great Adventure',
      type: 'movie',
      genre: 'Adventure',
      image: 'https://via.placeholder.com/300x450?text=The+Great+Adventure',
      year: 2020,
    },
    {
      id: 'movie-6',
      title: 'Inception',
      type: 'movie',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=Inception',
      year: 2022,
    },
    {
      id: 'movie-7',
      title: 'Pulp Fiction',
      type: 'movie',
      genre: 'Crime',
      image: 'https://via.placeholder.com/300x450?text=Pulp+Fiction',
      year: 2021,
    },
    {
      id: 'movie-8',
      title: 'The Godfather',
      type: 'movie',
      genre: 'Crime',
      image: 'https://via.placeholder.com/300x450?text=The+Godfather',
      year: 2020,
    },
    {
      id: 'movie-9',
      title: 'Interstellar',
      type: 'movie',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=Interstellar',
      year: 2019,
    },
    {
      id: 'movie-10',
      title: 'The Matrix',
      type: 'movie',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=The+Matrix',
      year: 2018,
    },
  ],
  shows: [
    {
      id: 'show-1',
      title: 'Stranger Things',
      type: 'tv',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=Stranger+Things',
      year: 2022,
    },
    {
      id: 'show-2',
      title: 'The Crown',
      type: 'tv',
      genre: 'Drama',
      image: 'https://via.placeholder.com/300x450?text=The+Crown',
      year: 2021,
    },
    {
      id: 'show-3',
      title: 'Breaking Bad',
      type: 'tv',
      genre: 'Crime',
      image: 'https://via.placeholder.com/300x450?text=Breaking+Bad',
      year: 2020,
    },
    {
      id: 'show-4',
      title: 'The Mandalorian',
      type: 'tv',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=The+Mandalorian',
      year: 2022,
    },
    {
      id: 'show-5',
      title: 'Game of Thrones',
      type: 'tv',
      genre: 'Fantasy',
      image: 'https://via.placeholder.com/300x450?text=Game+of+Thrones',
      year: 2019,
    },
    {
      id: 'show-6',
      title: 'The Office',
      type: 'tv',
      genre: 'Comedy',
      image: 'https://via.placeholder.com/300x450?text=The+Office',
      year: 2020,
    },
    {
      id: 'show-7',
      title: 'Black Mirror',
      type: 'tv',
      genre: 'Sci-Fi',
      image: 'https://via.placeholder.com/300x450?text=Black+Mirror',
      year: 2021,
    },
    {
      id: 'show-8',
      title: 'The Witcher',
      type: 'tv',
      genre: 'Fantasy',
      image: 'https://via.placeholder.com/300x450?text=The+Witcher',
      year: 2022,
    },
    {
      id: 'show-9',
      title: 'Euphoria',
      type: 'tv',
      genre: 'Drama',
      image: 'https://via.placeholder.com/300x450?text=Euphoria',
      year: 2021,
    },
    {
      id: 'show-10',
      title: 'The Boys',
      type: 'tv',
      genre: 'Action',
      image: 'https://via.placeholder.com/300x450?text=The+Boys',
      year: 2022,
    },
  ],
  actors: [
    {
      id: 'actor-1',
      name: 'Tom Hanks',
      image: 'https://via.placeholder.com/300x450?text=Tom+Hanks',
    },
    {
      id: 'actor-2',
      name: 'Leonardo DiCaprio',
      image: 'https://via.placeholder.com/300x450?text=Leonardo+DiCaprio',
    },
    {
      id: 'actor-3',
      name: 'Jennifer Lawrence',
      image: 'https://via.placeholder.com/300x450?text=Jennifer+Lawrence',
    },
    {
      id: 'actor-4',
      name: 'Scarlett Johansson',
      image: 'https://via.placeholder.com/300x450?text=Scarlett+Johansson',
    },
    {
      id: 'actor-5',
      name: 'Robert Downey Jr.',
      image: 'https://via.placeholder.com/300x450?text=Robert+Downey+Jr.',
    },
    {
      id: 'actor-6',
      name: 'Meryl Streep',
      image: 'https://via.placeholder.com/300x450?text=Meryl+Streep',
    },
    {
      id: 'actor-7',
      name: 'Brad Pitt',
      image: 'https://via.placeholder.com/300x450?text=Brad+Pitt',
    },
    {
      id: 'actor-8',
      name: 'Chadwick Boseman',
      image: 'https://via.placeholder.com/300x450?text=Chadwick+Boseman',
    },
    {
      id: 'actor-9',
      name: 'Emma Stone',
      image: 'https://via.placeholder.com/300x450?text=Emma+Stone',
    },
    {
      id: 'actor-10',
      name: 'Denzel Washington',
      image: 'https://via.placeholder.com/300x450?text=Denzel+Washington',
    },
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

// Content card component
const ContentCard = ({ item }) => {
  const path =
    item.type === 'movie'
      ? '/movie/'
      : item.type === 'tv'
      ? '/show/'
      : '/actor/'

  return (
    <Link to={`${path}${item.id}`} className="group">
      <div className="rounded-md overflow-hidden bg-[#1e1e1e] transition-transform duration-300 group-hover:scale-105 h-full flex flex-col">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.title || item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            {item.year && (
              <span className="text-white text-sm bg-[#5ccfee]/80 px-2 py-1 rounded-sm">
                {item.year}
              </span>
            )}
          </div>
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="text-white font-medium text-sm md:text-base truncate">
            {item.title || item.name}
          </h3>
          {item.genre && (
            <p className="text-gray-400 text-xs mt-1">{item.genre}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    movies: [],
    shows: [],
    actors: [],
    genres: [],
  })
  const [randomContent, setRandomContent] = useState([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Generate random content on initial load
  useEffect(() => {
    // Combine movies and shows for initial display
    const allContent = [...mockData.movies, ...mockData.shows]

    // Shuffle array and take first 12 items
    const shuffled = [...allContent].sort(() => 0.5 - Math.random())
    setRandomContent(shuffled.slice(0, 12))
  }, [])

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
      setSearchResults({
        movies: [],
        shows: [],
        actors: [],
        genres: [],
      })
      setSearchPerformed(false)
      return
    }

    setSearchPerformed(true)
    const query = debouncedQuery.toLowerCase()

    // Filter mock data based on query
    const filteredResults = {
      movies: mockData.movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query)
      ),
      shows: mockData.shows.filter(
        (show) =>
          show.title.toLowerCase().includes(query) ||
          show.genre.toLowerCase().includes(query)
      ),
      actors: mockData.actors.filter((actor) =>
        actor.name.toLowerCase().includes(query)
      ),
      genres: mockData.genres.filter((genre) =>
        genre.name.toLowerCase().includes(query)
      ),
    }

    setSearchResults(filteredResults)
  }, [debouncedQuery])

  // Combine filtered results for display
  const allResults = [
    ...searchResults.movies,
    ...searchResults.shows,
    ...searchResults.actors,
  ]

  // Check if there are any results
  const hasResults = allResults.length > 0

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* Search header */}
      <div className="pt-6 pb-8 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-xl md:text-2xl font-bold mb-4">
            Search
          </h1>
          <div className="relative">
            <input
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
      </div>

      {/* Search results or random content */}
      <div className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {searchPerformed ? (
            <>
              {/* Search results heading */}
              <div className="mb-6">
                {hasResults ? (
                  <h2 className="text-white text-lg font-medium">
                    Showing results for: "{debouncedQuery}"
                  </h2>
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    <p className="text-xl">
                      No results found for "{debouncedQuery}"
                    </p>
                    <p className="mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </div>

              {/* Search results display */}
              {hasResults && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                  {allResults.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              )}

              {/* Genre tags if any matched */}
              {searchResults.genres.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-white text-lg font-medium mb-4">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.genres.map((genre) => (
                      <Link
                        key={genre.id}
                        to={`/genre/${genre.id}`}
                        className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] text-white rounded-full text-sm transition-colors"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Random content heading */}
              <div className="mb-6">
                <h2 className="text-white text-lg font-medium">
                  Discover popular titles
                </h2>
              </div>

              {/* Random content display */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {randomContent.map((item) => (
                  <ContentCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
