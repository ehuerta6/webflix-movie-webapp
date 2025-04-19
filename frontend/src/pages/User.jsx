import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMovies, fetchGenres } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'

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
  const {
    userProfile,
    currentUser,
    fetchUserProfile,
    updateUserPassword,
    updateUserEmail,
  } = useAuth()
  const [userStats, setUserStats] = useState({
    movieCount: 0,
    showCount: 0,
  })

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
    profile: false,
  })

  // UI state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [availableGenres, setAvailableGenres] = useState([])

  // Form state - initialize once we have userProfile
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    selectedGenres: [],
  })

  const [settingsForm, setSettingsForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [settingsError, setSettingsError] = useState('')
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate user statistics
  useEffect(() => {
    if (userProfile) {
      const favorites = userProfile.favorites || []
      const watchlist = userProfile.watchlist || []

      const movieFavorites = favorites.filter(
        (item) => item.type === 'movie'
      ).length
      const showFavorites = favorites.filter(
        (item) => item.type === 'tv'
      ).length
      const movieWatchlist = watchlist.filter(
        (item) => item.type === 'movie'
      ).length
      const showWatchlist = watchlist.filter(
        (item) => item.type === 'tv'
      ).length

      setUserStats({
        movieCount: movieFavorites + movieWatchlist,
        showCount: showFavorites + showWatchlist,
      })
    }
  }, [userProfile])

  // Initialize form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        name: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        selectedGenres: userProfile.favoriteGenres || [],
      })

      setSettingsForm((prev) => ({
        ...prev,
        email: userProfile.email || '',
      }))
    }
  }, [userProfile])

  // Refresh user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading((prev) => ({ ...prev, profile: true }))
      await fetchUserProfile()
      setLoading((prev) => ({ ...prev, profile: false }))
    }

    loadUserProfile()
  }, [fetchUserProfile])

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
        // In a real app, you would fetch the user's liked movies from Firestore
        // For now, just fetch some popular movies as an example
        const data = await fetchMovies({ sort_by: 'popularity.desc' }, 1, 10)

        // Filter and format valid movies
        const formattedMovies = data.results
          .filter(isValidMovie)
          .map((movie) => formatMovieData(movie, genreMap))
          .slice(0, 8)

        setLikedMovies(formattedMovies)
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
        // In a real app, you would fetch the user's watchlist from Firestore
        // For now, just fetch some top-rated movies as an example
        const data = await fetchMovies({ sort_by: 'vote_average.desc' }, 1, 10)

        // Filter and format valid movies
        const formattedMovies = data.results
          .filter(isValidMovie)
          .map((movie) => formatMovieData(movie, genreMap))
          .slice(0, 8)

        setWatchlistMovies(formattedMovies)
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
      if (!userProfile?.favoriteGenres?.length || !Object.keys(genreMap).length)
        return

      setLoading((prev) => ({ ...prev, recommendations: true }))
      try {
        // Look up genre IDs from genre names
        const genreIds = Object.entries(genreMap)
          .filter(([_, name]) => userProfile.favoriteGenres.includes(name))
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
  }, [genreMap, userProfile])

  // Event handlers
  const handleGoBack = () => navigate(-1)

  const handleProfileEdit = () => {
    setEditForm({
      name: userProfile?.displayName || '',
      username: userProfile?.username || '',
      bio: userProfile?.bio || '',
      selectedGenres: userProfile?.favoriteGenres || [],
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading((prev) => ({ ...prev, profile: true }))

    try {
      // Update the profile in Firestore
      const userRef = doc(db, 'users', currentUser.uid)

      // Prepare update data
      const updateData = {
        displayName: editForm.name,
        username: editForm.username,
        bio: editForm.bio,
      }

      // Only include favoriteGenres if there are selections
      if (editForm.selectedGenres.length > 0) {
        updateData.favoriteGenres = editForm.selectedGenres
      }

      await updateDoc(userRef, updateData)

      // Refresh user profile
      await fetchUserProfile()
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }))
    }
  }

  const handleSettingsToggle = () => {
    if (!isSettingsOpen) {
      setSettingsForm({
        email: userProfile?.email || '',
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
    // Clear any previous error messages when form is changed
    setSettingsError('')
    setSettingsSuccess('')
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()

    // Reset status messages
    setSettingsError('')
    setSettingsSuccess('')
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!settingsForm.currentPassword) {
        throw new Error('Current password is required for any account changes')
      }

      let changesMade = false

      // Check if we need to update the password
      if (settingsForm.newPassword) {
        // Validate password
        if (settingsForm.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters')
        }

        // Check if passwords match
        if (settingsForm.newPassword !== settingsForm.confirmPassword) {
          throw new Error('New passwords do not match')
        }

        // Update password
        await updateUserPassword(
          settingsForm.currentPassword,
          settingsForm.newPassword
        )

        changesMade = true
        setSettingsSuccess((prev) => prev + 'Password updated successfully. ')
      }

      // Check if we need to update the email
      if (settingsForm.email !== userProfile.email) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(settingsForm.email)) {
          throw new Error('Please enter a valid email address')
        }

        // Update email
        await updateUserEmail(settingsForm.currentPassword, settingsForm.email)

        changesMade = true
        setSettingsSuccess((prev) => prev + 'Email updated successfully. ')
      }

      // If we get here with no changes made, show message
      if (!changesMade) {
        setSettingsSuccess('No changes were detected')
      }

      // Reset form (except email)
      setSettingsForm({
        email: settingsForm.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Close the settings form after a short delay
      setTimeout(() => {
        setIsSettingsOpen(false)
        setSettingsSuccess('')
      }, 2000)
    } catch (error) {
      console.error('Settings update error:', error)

      // Set appropriate error message based on Firebase error codes
      if (error.code) {
        // Firebase Auth errors have a code property
        switch (error.code) {
          case 'auth/wrong-password':
            setSettingsError('Incorrect current password')
            break
          case 'auth/requires-recent-login':
            setSettingsError(
              'For security reasons, please log out and log back in before changing your password'
            )
            break
          case 'auth/email-already-in-use':
            setSettingsError('This email is already in use by another account')
            break
          case 'auth/invalid-email':
            setSettingsError('The email address is not valid')
            break
          case 'auth/weak-password':
            setSettingsError('Password should be at least 6 characters')
            break
          case 'auth/too-many-requests':
            setSettingsError(
              'Too many unsuccessful attempts. Please try again later'
            )
            break
          default:
            setSettingsError(`Authentication error: ${error.message}`)
        }
      } else {
        // Regular Error object
        setSettingsError(error.message || 'Failed to update settings')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Movie collection actions
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
        <button
          className="text-gray-400 hover:text-gray-300"
          aria-label="Remove from watchlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
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

  if (!currentUser) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* User Profile Header Section */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-white flex items-center gap-1"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back</span>
            </button>

            <div className="flex gap-3">
              {!isEditingProfile && (
                <button
                  onClick={handleProfileEdit}
                  className="flex items-center gap-1 text-sm font-medium text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-md"
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
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profile
                </button>
              )}
              <button
                onClick={handleSettingsToggle}
                className="flex items-center gap-1 text-sm font-medium text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-md"
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* User info card */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            {/* Profile header with background */}
            <div className="h-32 bg-gradient-to-r from-[#00BFFF] to-[#5ccfee] relative">
              <div className="absolute -bottom-12 left-8 h-24 w-24 bg-[#1a1a1a] rounded-full border-4 border-[#1a1a1a] overflow-hidden">
                <div className="h-full w-full bg-[#5ccfee] flex items-center justify-center text-3xl font-bold text-[#1a1a1a]">
                  {userProfile?.displayName?.charAt(0).toUpperCase() ||
                    currentUser?.email?.charAt(0).toUpperCase() ||
                    'U'}
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="pt-16 pb-6 px-8">
              <div className="mb-4">
                <h1 className="text-2xl font-bold">
                  {isEditingProfile ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full max-w-md"
                      placeholder="Display Name"
                    />
                  ) : (
                    userProfile?.displayName || 'Webflix User'
                  )}
                </h1>
                {isEditingProfile ? (
                  <div className="mt-2 mb-2">
                    <label className="block text-sm font-bold text-gray-300 mb-1">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleEditFormChange}
                      className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full max-w-md"
                      placeholder="Username (no spaces)"
                    />
                  </div>
                ) : (
                  userProfile?.username && (
                    <p className="text-[#5ccfee] font-medium">
                      @{userProfile.username}
                    </p>
                  )
                )}
                <p className="text-gray-400">{currentUser?.email}</p>
              </div>

              {/* Bio section */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-300 mb-2">
                  ABOUT ME
                </h2>
                {isEditingProfile ? (
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    rows="3"
                    className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full max-w-lg"
                    placeholder="Tell us about yourself and what you like to watch..."
                  ></textarea>
                ) : (
                  <p className="text-gray-300">
                    {userProfile?.bio ||
                      'No bio yet. Click Edit Profile to add one!'}
                  </p>
                )}
              </div>

              {/* Favorite Genres section */}
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-300 mb-2">
                  FAVORITE GENRES
                </h2>
                {isEditingProfile ? (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {loading.genres ? (
                      <div className="flex items-center text-gray-400 text-xs py-1">
                        <div className="animate-spin h-3 w-3 border-b border-[#5ccfee] rounded-full mr-2"></div>
                        Loading genres...
                      </div>
                    ) : availableGenres.length > 0 ? (
                      availableGenres.map((genre) => (
                        <GenreToggle
                          key={genre}
                          genre={genre}
                          selected={editForm.selectedGenres.includes(genre)}
                          onToggle={handleGenreToggle}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No genres available
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.favoriteGenres?.length > 0 ? (
                      userProfile.favoriteGenres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#252525] text-[#5ccfee] rounded-md text-sm"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No favorite genres selected yet. Click Edit Profile to
                        add some!
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* User stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-[#5ccfee]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>
                  }
                  label="Movies"
                  value={userStats.movieCount}
                />
                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-[#5ccfee]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  label="TV Shows"
                  value={userStats.showCount}
                />
                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-[#5ccfee]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  }
                  label="Favorites"
                  value={(userProfile?.favorites || []).length}
                />
                <StatItem
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-2 text-[#5ccfee]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  }
                  label="Watchlist"
                  value={(userProfile?.watchlist || []).length}
                />
              </div>

              {/* Settings form */}
              {isSettingsOpen && (
                <div className="bg-[#1e1e1e] rounded-lg p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Account Settings</h2>
                  <form onSubmit={handleSettingsSubmit}>
                    <div className="grid gap-4 max-w-md">
                      {/* Error message */}
                      {settingsError && (
                        <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm">
                          {settingsError}
                        </div>
                      )}

                      {/* Success message */}
                      {settingsSuccess && (
                        <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm">
                          {settingsSuccess}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={settingsForm.email}
                          onChange={handleSettingsFormChange}
                          className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full"
                          placeholder="Email"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Current Password{' '}
                          <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={settingsForm.currentPassword}
                          onChange={handleSettingsFormChange}
                          className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full"
                          placeholder="Current Password"
                          required
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Required for any account changes
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={settingsForm.newPassword}
                          onChange={handleSettingsFormChange}
                          className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full"
                          placeholder="New Password"
                          disabled={isSubmitting}
                        />
                        {settingsForm.newPassword &&
                          settingsForm.newPassword.length < 6 && (
                            <p className="text-xs text-yellow-400 mt-1">
                              Password must be at least 6 characters
                            </p>
                          )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={settingsForm.confirmPassword}
                          onChange={handleSettingsFormChange}
                          className="bg-[#252525] text-white px-3 py-1.5 rounded border border-[#333] w-full"
                          placeholder="Confirm New Password"
                          disabled={isSubmitting}
                        />
                        {settingsForm.newPassword &&
                          settingsForm.confirmPassword &&
                          settingsForm.newPassword !==
                            settingsForm.confirmPassword && (
                            <p className="text-xs text-red-400 mt-1">
                              Passwords do not match
                            </p>
                          )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleSettingsToggle}
                          className="px-4 py-2 text-sm font-medium rounded bg-[#252525] text-gray-200 hover:bg-[#333] disabled:opacity-50"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium rounded bg-[#5ccfee] text-black hover:bg-[#4abfe0] disabled:opacity-50 flex items-center justify-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Edit profile form submission buttons */}
              {isEditingProfile && (
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded text-white bg-[#333] hover:bg-[#444]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileSubmit}
                    className="px-4 py-2 rounded text-black bg-[#5ccfee] hover:bg-[#4abfe0]"
                  >
                    Save Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        {loading.profile ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-[#5ccfee] rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-4">
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
        )}
      </div>
    </div>
  )
}

export default User
