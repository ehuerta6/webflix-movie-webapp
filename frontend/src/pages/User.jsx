import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import profilePic from '../assets/profile-pic.jpg'
import moviePlaceholder from '../assets/movie-placeholder.png'
import { fetchMovies, fetchGenres, fetchTrending } from '../services/api'

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
      : moviePlaceholder,
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
const MovieCard = ({ movie, actions }) => (
  <div className="w-36 bg-[#252525] rounded overflow-hidden flex-shrink-0">
    <div className="w-full h-48 relative">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = moviePlaceholder
        }}
      />
      <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
        {movie.rating}
      </div>
      {movie.genre && (
        <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
          <span className="text-xs px-1.5 py-0.5 bg-[#5ccfee] bg-opacity-20 text-white rounded-full font-bold">
            {movie.genre}
          </span>
        </div>
      )}
    </div>
    <div className="p-2">
      <h4 className="font-medium text-white text-xs mb-0.5 truncate">
        {movie.title}
      </h4>
      <p className="text-gray-400 text-xs">{movie.year}</p>
      <div className="mt-1 flex justify-between">{actions}</div>
    </div>
  </div>
)

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
  <div className="bg-[#252525] p-3 rounded">
    <div className="flex items-center">
      {icon}
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
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

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    profilePicture: profilePic,
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

  // Available genres for selection
  const [availableGenres, setAvailableGenres] = useState([])

  // Form state
  const [editForm, setEditForm] = useState({
    name: userData.name,
    bio: userData.bio,
    selectedGenres: userData.favoriteGenres,
  })

  const [settingsForm, setSettingsForm] = useState({
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Mock movie collections
  const collections = {
    liked: [
      {
        id: 1,
        title: 'Inception',
        poster: moviePlaceholder,
        year: 2010,
        rating: 8.8,
      },
      {
        id: 2,
        title: 'The Shawshank Redemption',
        poster: moviePlaceholder,
        year: 1994,
        rating: 9.3,
      },
      {
        id: 3,
        title: 'The Dark Knight',
        poster: moviePlaceholder,
        year: 2008,
        rating: 9.0,
      },
    ],
    watchlist: [
      {
        id: 4,
        title: 'Pulp Fiction',
        poster: moviePlaceholder,
        year: 1994,
        rating: 8.9,
      },
      {
        id: 5,
        title: 'The Godfather',
        poster: moviePlaceholder,
        year: 1972,
        rating: 9.2,
      },
      {
        id: 6,
        title: 'Interstellar',
        poster: moviePlaceholder,
        year: 2014,
        rating: 8.6,
      },
    ],
    recommendations: [
      {
        id: 7,
        title: 'Blade Runner 2049',
        poster: moviePlaceholder,
        year: 2017,
        rating: 8.0,
        genre: 'Sci-Fi',
      },
      {
        id: 8,
        title: 'The Departed',
        poster: moviePlaceholder,
        year: 2006,
        rating: 8.5,
        genre: 'Drama',
      },
      {
        id: 9,
        title: 'John Wick',
        poster: moviePlaceholder,
        year: 2014,
        rating: 7.4,
        genre: 'Action',
      },
    ],
  }

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
      if (currentGenres.includes(genre)) {
        return {
          ...prev,
          selectedGenres: currentGenres.filter((g) => g !== genre),
        }
      } else {
        return { ...prev, selectedGenres: [...currentGenres, genre] }
      }
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

    // Recommendations will automatically update due to the dependency on favoriteGenres
  }

  const handleSettingsToggle = () => {
    setSettingsForm({
      email: userData.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setIsSettingsOpen(!isSettingsOpen)
  }

  const handleSettingsFormChange = (e) => {
    const { name, value } = e.target
    setSettingsForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    // Mock update - in a real app this would save to backend
    setUserData((prev) => ({ ...prev, email: settingsForm.email }))
    setIsSettingsOpen(false)
  }

  // Render movie collection with appropriate actions and loading state
  const renderMovieCollection = (movies, title, actions, isLoading) => (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {title === 'Recommended For You' && (
        <p className="text-gray-400 text-xs mb-2">
          Based on your favorite genres
        </p>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5ccfee]"></div>
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
            : 'No movies found'}
        </div>
      )}
    </div>
  )

  // Action buttons for different collections
  const collectionActions = {
    liked: (movie) => (
      <>
        <button className="text-red-500 hover:text-red-400">
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
        <button className="text-[#5ccfee] hover:text-[#4ab3d3]">
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
        <button className="text-[#5ccfee] hover:text-[#4ab3d3]">
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
        <button className="text-gray-400 hover:text-gray-300">
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

        // Create genre map for lookup
        const map = {}
        const genreNames = []

        // First add movie genres
        movieGenres.forEach((genre) => {
          map[genre.id] = genre.name
          genreNames.push(genre.name)
        })

        // Then add TV genres (some may overlap)
        tvGenres.forEach((genre) => {
          map[genre.id] = genre.name
          if (!genreNames.includes(genre.name)) {
            genreNames.push(genre.name)
          }
        })

        setGenreMap(map)
        setAvailableGenres(genreNames.sort())
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
      setLoading((prev) => ({ ...prev, liked: true }))
      try {
        // Fetch popular movies as proxy for 'liked' movies
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

    if (Object.keys(genreMap).length > 0) {
      fetchLikedMovies()
    }
  }, [genreMap])

  // Load 'watchlist' movies data
  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      setLoading((prev) => ({ ...prev, watchlist: true }))
      try {
        // Fetch top-rated movies as proxy for 'watchlist'
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

    if (Object.keys(genreMap).length > 0) {
      fetchWatchlistMovies()
    }
  }, [genreMap])

  // Fetch movie recommendations based on favorite genres
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData.favoriteGenres.length) return

      setLoading((prev) => ({ ...prev, recommendations: true }))
      try {
        // Look up genre IDs from genre names
        const genreIds = Object.entries(genreMap)
          .filter(([_, name]) => userData.favoriteGenres.includes(name))
          .map(([id]) => id)
          .join(',')

        // Only fetch if we have valid genre IDs
        if (genreIds) {
          const data = await fetchMovies({ with_genres: genreIds }, 1, 10)

          // Filter and format valid movies
          const formattedMovies = data.results
            .filter(isValidMovie)
            .map((movie) => formatMovieData(movie, genreMap))
            .slice(0, 8)

          setRecommendedMovies(formattedMovies)
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading((prev) => ({ ...prev, recommendations: false }))
      }
    }

    if (
      Object.keys(genreMap).length > 0 &&
      userData.favoriteGenres.length > 0
    ) {
      fetchRecommendations()
    }
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
          {/* User Profile Card */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            {isEditingProfile ? (
              // Edit profile form
              <form onSubmit={handleProfileSubmit} className="p-4">
                <div className="flex flex-col md:flex-row md:gap-4 items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-2 md:mb-0 border border-[#5ccfee]">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
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
                        rows="2"
                        className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee] resize-none"
                      ></textarea>
                    </div>

                    {/* Favorite Genres Selection */}
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Favorite Genres
                      </label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
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
                  </div>

                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-xs rounded transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black text-xs font-semibold rounded transition duration-200"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // Profile display
              <div className="p-4 flex flex-col md:flex-row md:items-center">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-4 border border-[#5ccfee]">
                    <img
                      src={profilePic}
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">{userData.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {userData.bio}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={handleProfileEdit}
                        className="inline-flex items-center px-3 py-1 bg-[#252525] hover:bg-[#333] text-xs rounded transition duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={handleSettingsToggle}
                        className="inline-flex items-center px-3 py-1 bg-[#252525] hover:bg-[#333] text-xs rounded transition duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1"
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
                </div>
              </div>
            )}

            {/* Settings Modal */}
            {isSettingsOpen && (
              <div className="border-t border-[#2a2a2a] p-4">
                <form onSubmit={handleSettingsSubmit} className="space-y-3">
                  <h3 className="text-sm font-semibold mb-2">
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
                      className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
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
                      className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
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
                      className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
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
                      className="w-full bg-[#252525] text-white px-3 py-1.5 text-sm rounded border border-[#333] focus:outline-none focus:ring-1 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSettingsToggle}
                      className="px-3 py-1.5 bg-[#333] hover:bg-[#444] text-xs rounded transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black text-xs font-semibold rounded transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* User Stats */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#5ccfee] mr-2"
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
                  }
                  label="Watched"
                  value={userData.stats.moviesWatched}
                />

                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#5ccfee] mr-2"
                      fill="none"
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
                  }
                  label="Liked"
                  value={userData.stats.moviesLiked}
                />

                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#5ccfee] mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  }
                  label="Watchlist"
                  value={userData.stats.watchlistCount}
                />
              </div>

              {/* Favorite Genres */}
              <div>
                <h4 className="text-xs font-semibold mb-2 text-gray-400">
                  Favorite Genres
                </h4>
                <div className="flex flex-wrap gap-1">
                  {loading.genres ? (
                    <div className="flex items-center text-gray-400 text-xs py-1">
                      <div className="animate-spin h-3 w-3 border-b border-[#5ccfee] rounded-full mr-2"></div>
                      Loading...
                    </div>
                  ) : userData.favoriteGenres.length > 0 ? (
                    userData.favoriteGenres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-[#5ccfee] bg-opacity-20 text-white rounded-full text-xs font-bold"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">
                      No favorite genres selected yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Movie Collections */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            <div className="p-4 space-y-4">
              {renderMovieCollection(
                likedMovies,
                'Liked Movies',
                collectionActions.liked,
                loading.liked
              )}

              {renderMovieCollection(
                watchlistMovies,
                'Watchlist',
                collectionActions.watchlist,
                loading.watchlist
              )}

              {renderMovieCollection(
                recommendedMovies,
                'Recommended For You',
                collectionActions.recommendations,
                loading.recommendations
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
