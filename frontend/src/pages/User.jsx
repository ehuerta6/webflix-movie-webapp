import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMovies, fetchGenres } from '../services/api'

// Helper function to validate movie data
const isValidMovie = (movie) => {
  return (
    movie &&
    movie.id &&
    (movie.title || movie.name) &&
    movie.poster_path &&
    movie.vote_average !== undefined
  )
}

// Format movie data for consistent display
const formatMovieData = (movie, genreMap = {}) => {
  return {
    id: movie.id,
    title: movie.title || movie.name,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : 'https://via.placeholder.com/342x513?text=No+Image',
    year:
      movie.release_date || movie.first_air_date
        ? new Date(movie.release_date || movie.first_air_date).getFullYear()
        : 'Unknown',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    genre:
      movie.genre_ids && movie.genre_ids[0] && genreMap[movie.genre_ids[0]]
        ? genreMap[movie.genre_ids[0]]
        : null,
  }
}

// MovieCard component for reuse in different collections
const MovieCard = ({ movie, actions }) => {
  if (!movie.poster || !movie.title) return null

  return (
    <div className="bg-[#1e1e1e] rounded overflow-hidden flex-shrink-0 hover:translate-y-[-4px] transition-transform duration-200 w-36">
      <div className="w-full h-48 relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/342x513?text=No+Image'
          }}
          loading="lazy"
        />
        {movie.rating && (
          <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
            <span className="text-[#5ccfee]">{movie.rating}</span>
          </div>
        )}
        {movie.genre && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
            <span className="text-xs text-[#5ccfee] font-medium truncate max-w-[70%]">
              {movie.genre}
            </span>
          </div>
        )}
      </div>
      <div className="p-2">
        <h4 className="font-medium text-gray-200 text-sm mb-0.5 truncate">
          {movie.title}
        </h4>
        <p className="text-gray-400 text-xs">{movie.year}</p>
        {actions && <div className="mt-1 flex justify-between">{actions}</div>}
      </div>
    </div>
  )
}

// GenreToggle component for selecting genres
const GenreToggle = ({ genre, selected, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(genre)}
    className={`px-2 py-0.5 text-xs rounded-full ${
      selected
        ? 'bg-[#5ccfee] text-black font-bold'
        : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
    }`}
  >
    {genre}
  </button>
)

// Stat component for user statistics
const StatItem = ({ icon, label, value }) => (
  <div className="bg-[#1e1e1e] p-2 rounded flex items-center">
    {icon}
    <div>
      <p className="text-gray-400 text-xs leading-tight">{label}</p>
      <p className="text-sm font-bold leading-tight">{value}</p>
    </div>
  </div>
)

function User() {
  const navigate = useNavigate()

  // API data state
  const [genreMap, setGenreMap] = useState({})
  const [likedMovies, setLikedMovies] = useState([])
  const [watchlistMovies, setWatchlistMovies] = useState([])
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState({
    genres: false,
    liked: false,
    watchlist: false,
    recommendations: false,
  })

  // User data
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bio: 'Movie enthusiast and aspiring critic. I love everything from classic films to modern blockbusters.',
    stats: {
      moviesWatched: 120,
      moviesLiked: 45,
      watchlistCount: 30,
    },
    favoriteGenres: ['Action', 'Drama', 'Sci-Fi', 'Thriller'],
  })

  // UI state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [availableGenres, setAvailableGenres] = useState([])

  // Form state - initialize only once
  const [editForm, setEditForm] = useState({
    name: userData.name,
    bio: userData.bio,
    selectedGenres: [...userData.favoriteGenres],
  })

  const [settingsForm, setSettingsForm] = useState({
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Event handlers
  const handleGoBack = () => navigate(-1)

  const handleProfileEdit = () => {
    setEditForm({
      name: userData.name,
      bio: userData.bio,
      selectedGenres: [...userData.favoriteGenres],
    })
    setIsEditingProfile(true)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenreToggle = (genre) => {
    setEditForm((prev) => {
      const currentGenres = [...prev.selectedGenres]
      const index = currentGenres.indexOf(genre)

      if (index !== -1) {
        currentGenres.splice(index, 1)
      } else {
        currentGenres.push(genre)
      }

      return { ...prev, selectedGenres: currentGenres }
    })
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setUserData((prev) => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio,
      favoriteGenres: editForm.selectedGenres,
    }))
    setIsEditingProfile(false)
  }

  const handleSettingsToggle = () => {
    if (!isSettingsOpen) {
      setSettingsForm({
        email: userData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleSettingsFormChange = (e) => {
    const { name, value } = e.target
    setSettingsForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    setUserData((prev) => ({ ...prev, email: settingsForm.email }))
    setIsSettingsOpen(false)
  }

  // Action buttons for different collections
  const collectionActions = {
    liked: (movie) => (
      <>
        <button className="text-red-500 hover:text-red-400" aria-label="Unlike">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="text-[#5ccfee] hover:text-[#4ab3d3]"
          aria-label="View details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </>
    ),
    watchlist: (movie) => (
      <>
        <button
          className="text-[#5ccfee] hover:text-[#4ab3d3]"
          aria-label="View details"
        >
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        <button
          className="text-gray-400 hover:text-gray-300"
          aria-label="Remove from watchlist"
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </>
    ),
    recommendations: (movie) => (
      <div className="flex space-x-1 w-full">
        <button className="flex-1 text-xs text-center py-0.5 rounded bg-[#1d1d1d] hover:bg-[#333] text-gray-300 text-[10px]">
          + Watch
        </button>
        <button className="flex-1 text-xs text-center py-0.5 rounded bg-[#1d1d1d] hover:bg-[#333] text-gray-300 text-[10px]">
          Like
        </button>
      </div>
    ),
  }

  // Render a movie collection section
  const MovieCollection = ({
    title,
    movies,
    actions,
    isLoading,
    description,
  }) => (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-gray-200">{title}</h3>
      {description && (
        <p className="text-gray-400 text-xs mb-3">{description}</p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5ccfee]"></div>
        </div>
      ) : movies.length > 0 ? (
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3 min-w-max">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                actions={actions(movie)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-sm py-4 text-center">
          {title === 'Recommended For You'
            ? 'Select favorite genres to get recommendations'
            : `No ${title.toLowerCase()} found`}
        </div>
      )}
    </div>
  )

  // Load genre data for mapping IDs to names
  useEffect(() => {
    const loadGenres = async () => {
      setLoading((prev) => ({ ...prev, genres: true }))
      try {
        // Fetch movie and TV genres
        const [movieGenres, tvGenres] = await Promise.all([
          fetchGenres('movie'),
          fetchGenres('tv'),
        ])

        // Create genre map and list
        const map = {}
        const genreNames = new Set()

        // Add movie genres to map
        movieGenres.forEach((genre) => {
          map[genre.id] = genre.name
          genreNames.add(genre.name)
        })

        // Add TV genres to map (some may overlap)
        tvGenres.forEach((genre) => {
          map[genre.id] = genre.name
          genreNames.add(genre.name)
        })

        setGenreMap(map)
        setAvailableGenres([...genreNames].sort())
      } catch (error) {
        console.error('Error fetching genres:', error)
      } finally {
        setLoading((prev) => ({ ...prev, genres: false }))
      }
    }

    loadGenres()
  }, [])

  // Load 'liked' movies data
  useEffect(() => {
    const fetchLikedMovies = async () => {
      if (!Object.keys(genreMap).length) return

      setLoading((prev) => ({ ...prev, liked: true }))
      try {
        const data = await fetchMovies({ sort_by: 'popularity.desc' }, 1, 10)

        // Filter and format valid movies
        const formattedMovies = data.results
          .filter(isValidMovie)
          .map((movie) => formatMovieData(movie, genreMap))
          .slice(0, 8)

        setLikedMovies(formattedMovies)

        // Update stats
        setUserData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            moviesLiked: formattedMovies.length,
          },
        }))
      } catch (error) {
        console.error('Error fetching liked movies:', error)
      } finally {
        setLoading((prev) => ({ ...prev, liked: false }))
      }
    }

    fetchLikedMovies()
  }, [genreMap])

  // Load 'watchlist' movies data
  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (!Object.keys(genreMap).length) return

      setLoading((prev) => ({ ...prev, watchlist: true }))
      try {
        const data = await fetchMovies({ sort_by: 'vote_average.desc' }, 1, 10)

        // Filter and format valid movies
        const formattedMovies = data.results
          .filter(isValidMovie)
          .map((movie) => formatMovieData(movie, genreMap))
          .slice(0, 8)

        setWatchlistMovies(formattedMovies)

        // Update stats
        setUserData((prev) => ({
          ...prev,
          stats: {
            ...prev.stats,
            watchlistCount: formattedMovies.length,
          },
        }))
      } catch (error) {
        console.error('Error fetching watchlist movies:', error)
      } finally {
        setLoading((prev) => ({ ...prev, watchlist: false }))
      }
    }

    fetchWatchlistMovies()
  }, [genreMap])

  // Fetch movie recommendations based on favorite genres
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData.favoriteGenres.length || !Object.keys(genreMap).length)
        return

      setLoading((prev) => ({ ...prev, recommendations: true }))
      try {
        // Look up genre IDs from genre names
        const genreIds = Object.entries(genreMap)
          .filter(([_, name]) => userData.favoriteGenres.includes(name))
          .map(([id]) => id)
          .join(',')

        if (!genreIds) {
          setRecommendedMovies([])
          return
        }

        const data = await fetchMovies({ with_genres: genreIds }, 1, 10)

        // Filter and format valid movies
        const formattedMovies = data.results
          .filter(isValidMovie)
          .map((movie) => formatMovieData(movie, genreMap))
          .slice(0, 8)

        setRecommendedMovies(formattedMovies)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading((prev) => ({ ...prev, recommendations: false }))
      }
    }

    fetchRecommendations()
  }, [genreMap, userData.favoriteGenres])

  return (
    <div className="min-h-screen bg-[#121212] text-white py-4 px-3">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Header with Back Button and Page Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-1.5 text-white bg-[#1e1e1e] hover:bg-[#2e2e2e] px-3 py-1.5 rounded-md transition-colors text-sm"
            >
              <span className="text-sm">←</span> Go Back
            </button>
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* User Profile Card - Redesigned for minimalism */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            {isEditingProfile ? (
              // Edit profile form
              <form onSubmit={handleProfileSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      About Me
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditFormChange}
                      rows="3"
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee] resize-none"
                    ></textarea>
                  </div>

                  {/* Favorite Genres Selection */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Favorite Genres
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {loading.genres ? (
                        <div className="flex items-center text-gray-400 text-xs py-1">
                          <div className="animate-spin h-3 w-3 border-b border-[#5ccfee] rounded-full mr-2"></div>
                          Loading genres...
                        </div>
                      ) : (
                        availableGenres.map((genre) => (
                          <GenreToggle
                            key={genre}
                            genre={genre}
                            selected={editForm.selectedGenres.includes(genre)}
                            onToggle={handleGenreToggle}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-[#333] hover:bg-[#444] text-sm rounded transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black text-sm font-semibold rounded transition duration-200"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // Minimalist profile display
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {userData.name}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xl">
                      {userData.bio}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProfileEdit}
                      className="flex items-center px-3 py-1.5 bg-transparent hover:bg-[#2a2a2a] border border-[#444] text-sm rounded-md transition duration-200"
                      aria-label="Edit profile"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleSettingsToggle}
                      className="flex items-center px-3 py-1.5 bg-transparent hover:bg-[#2a2a2a] border border-[#444] text-sm rounded-md transition duration-200"
                      aria-label="Settings"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Settings
                    </button>
                  </div>
                </div>

                {/* User Activity Stats - More visual and minimalistic */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#252525] rounded-md p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#5ccfee]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-[#5ccfee] text-2xl font-bold mb-1">
                      {userData.stats.moviesLiked}
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Liked
                    </div>
                  </div>
                  <div className="bg-[#252525] rounded-md p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#5ccfee]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                    <div className="text-[#5ccfee] text-2xl font-bold mb-1">
                      {userData.stats.watchlistCount}
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">
                      Watchlist
                    </div>
                  </div>
                </div>

                {/* Favorite Genres */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">
                    Favorite Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {loading.genres ? (
                      <div className="flex items-center text-gray-400 text-xs py-0.5">
                        <div className="animate-spin h-3 w-3 border-b border-[#5ccfee] rounded-full mr-1"></div>
                        Loading...
                      </div>
                    ) : userData.favoriteGenres.length > 0 ? (
                      userData.favoriteGenres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#252525] text-[#5ccfee] rounded-md text-sm"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No favorite genres selected yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
              <div className="border-t border-[#2a2a2a] p-6">
                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Account Settings
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={settingsForm.email}
                      onChange={handleSettingsFormChange}
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={settingsForm.currentPassword}
                      onChange={handleSettingsFormChange}
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={settingsForm.newPassword}
                      onChange={handleSettingsFormChange}
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={settingsForm.confirmPassword}
                      onChange={handleSettingsFormChange}
                      className="w-full bg-[#252525] text-white px-3 py-2 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSettingsToggle}
                      className="px-4 py-2 bg-[#333] hover:bg-[#444] text-sm rounded transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black text-sm font-semibold rounded transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Movie Collections */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            <div className="p-4 space-y-6">
              <MovieCollection
                title="Liked Movies"
                movies={likedMovies}
                actions={collectionActions.liked}
                isLoading={loading.liked}
              />

              <MovieCollection
                title="Watchlist"
                movies={watchlistMovies}
                actions={collectionActions.watchlist}
                isLoading={loading.watchlist}
              />

              <MovieCollection
                title="Recommended For You"
                movies={recommendedMovies}
                actions={collectionActions.recommendations}
                isLoading={loading.recommendations}
                description="Based on your favorite genres"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
