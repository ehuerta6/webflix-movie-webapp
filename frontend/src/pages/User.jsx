import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import profilePic from '../assets/profile-pic.jpg'

function User() {
  const navigate = useNavigate()

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

  // State for edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // State for settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Available genres for selection
  const availableGenres = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
    'Western',
  ]

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: userData.name,
    bio: userData.bio,
    selectedGenres: userData.favoriteGenres,
  })

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Mock movie data
  const likedMovies = [
    {
      id: 1,
      title: 'Inception',
      poster: profilePic,
      year: 2010,
      rating: 8.8,
    },
    {
      id: 2,
      title: 'The Shawshank Redemption',
      poster: profilePic,
      year: 1994,
      rating: 9.3,
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster: profilePic,
      year: 2008,
      rating: 9.0,
    },
  ]

  const watchlist = [
    {
      id: 4,
      title: 'Pulp Fiction',
      poster: profilePic,
      year: 1994,
      rating: 8.9,
    },
    {
      id: 5,
      title: 'The Godfather',
      poster: profilePic,
      year: 1972,
      rating: 9.2,
    },
    {
      id: 6,
      title: 'Interstellar',
      poster: profilePic,
      year: 2014,
      rating: 8.6,
    },
  ]

  const recommendations = [
    {
      id: 7,
      title: 'Blade Runner 2049',
      poster: profilePic,
      year: 2017,
      rating: 8.0,
      genre: 'Sci-Fi',
    },
    {
      id: 8,
      title: 'The Departed',
      poster: profilePic,
      year: 2006,
      rating: 8.5,
      genre: 'Drama',
    },
    {
      id: 9,
      title: 'John Wick',
      poster: profilePic,
      year: 2014,
      rating: 7.4,
      genre: 'Action',
    },
  ]

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1) // Go back to the previous page in history
  }

  // Handler functions
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
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
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
        return {
          ...prev,
          selectedGenres: [...currentGenres, genre],
        }
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
    setSettingsForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    // Mock update - in a real app this would save to backend
    setUserData((prev) => ({
      ...prev,
      email: settingsForm.email,
    }))
    setIsSettingsOpen(false)
  }

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
          {/* Container 1: User Info & About */}
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
                        {availableGenres.map((genre) => (
                          <button
                            type="button"
                            key={genre}
                            onClick={() => handleGenreToggle(genre)}
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              editForm.selectedGenres.includes(genre)
                                ? 'bg-[#5ccfee] text-black font-bold'
                                : 'bg-[#252525] text-gray-300 hover:bg-[#333]'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
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

          {/* Container 2: User Stats */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-[#252525] p-3 rounded">
                  <div className="flex items-center">
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
                    <div>
                      <p className="text-gray-400 text-xs">Watched</p>
                      <p className="text-base font-bold">
                        {userData.stats.moviesWatched}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#252525] p-3 rounded">
                  <div className="flex items-center">
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
                    <div>
                      <p className="text-gray-400 text-xs">Liked</p>
                      <p className="text-base font-bold">
                        {userData.stats.moviesLiked}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#252525] p-3 rounded">
                  <div className="flex items-center">
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
                    <div>
                      <p className="text-gray-400 text-xs">Watchlist</p>
                      <p className="text-base font-bold">
                        {userData.stats.watchlistCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorite Genres */}
              <div>
                <h4 className="text-xs font-semibold mb-2 text-gray-400">
                  Favorite Genres
                </h4>
                <div className="flex flex-wrap gap-1">
                  {userData.favoriteGenres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-[#5ccfee] bg-opacity-20 text-white rounded-full text-xs font-bold"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Container 3: Collections */}
          <div className="bg-[#1e1e1e] rounded-lg shadow-md overflow-hidden border border-[#2a2a2a]">
            <div className="p-4 space-y-4">
              {/* Liked Movies */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Liked Movies</h3>
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-3 min-w-max">
                    {likedMovies.map((movie) => (
                      <div
                        key={movie.id}
                        className="w-36 bg-[#252525] rounded overflow-hidden flex-shrink-0"
                      >
                        <div className="w-full h-48 relative">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                            {movie.rating}
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-white text-xs mb-0.5 truncate">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                          <div className="mt-1 flex justify-between">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Watchlist */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Watchlist</h3>
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-3 min-w-max">
                    {watchlist.map((movie) => (
                      <div
                        key={movie.id}
                        className="w-36 bg-[#252525] rounded overflow-hidden flex-shrink-0"
                      >
                        <div className="w-full h-48 relative">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                            {movie.rating}
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-white text-xs mb-0.5 truncate">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                          <div className="mt-1 flex justify-between">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Recommended For You
                </h3>
                <p className="text-gray-400 text-xs mb-2">
                  Based on your favorite genres
                </p>
                <div className="overflow-x-auto pb-2">
                  <div className="flex space-x-3 min-w-max">
                    {recommendations.map((movie) => (
                      <div
                        key={movie.id}
                        className="w-36 bg-[#252525] rounded overflow-hidden flex-shrink-0"
                      >
                        <div className="w-full h-48 relative">
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
                            {movie.rating}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black to-transparent">
                            <span className="text-xs px-1.5 py-0.5 bg-[#5ccfee] bg-opacity-20 text-white rounded-full font-bold">
                              {movie.genre}
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-white text-xs mb-0.5 truncate">
                            {movie.title}
                          </h4>
                          <p className="text-gray-400 text-xs">{movie.year}</p>
                          <div className="mt-1 flex space-x-1">
                            <button className="flex-1 text-xs text-center py-0.5 rounded bg-[#1d1d1d] hover:bg-[#333] text-gray-300 text-[10px]">
                              + Watch
                            </button>
                            <button className="flex-1 text-xs text-center py-0.5 rounded bg-[#1d1d1d] hover:bg-[#333] text-gray-300 text-[10px]">
                              Like
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default User
