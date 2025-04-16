import { useState } from 'react'

function User() {
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    profilePicture: 'https://i.pravatar.cc/150?img=5',
    bio: 'Movie enthusiast and aspiring critic. I love everything from classic films to modern blockbusters.',
    location: 'New York, NY',
    socialLinks: {
      twitter: '@janesmith',
      instagram: '@jane.watches.movies',
    },
    stats: {
      moviesWatched: 120,
      moviesLiked: 45,
      watchlistCount: 30,
    },
    favoriteGenres: ['Action', 'Drama', 'Sci-Fi', 'Thriller'],
  })

  // State for edit mode
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)

  // State for collections tab
  const [activeTab, setActiveTab] = useState('liked')

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: userData.name,
    bio: userData.bio,
    profilePicture: userData.profilePicture,
    location: userData.location,
    twitter: userData.socialLinks.twitter,
    instagram: userData.socialLinks.instagram,
  })

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    email: userData.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Bio state
  const [bioText, setBioText] = useState(userData.bio)

  // Mock movie data
  const likedMovies = [
    {
      id: 1,
      title: 'Inception',
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      year: 2010,
      rating: 8.8,
    },
    {
      id: 2,
      title: 'The Shawshank Redemption',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      year: 1994,
      rating: 9.3,
    },
    {
      id: 3,
      title: 'The Dark Knight',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      year: 2008,
      rating: 9.0,
    },
  ]

  const watchlist = [
    {
      id: 4,
      title: 'Pulp Fiction',
      poster: 'https://image.tmdb.org/t/p/w500/fIE3lAGcZDV1G6XM5KmuWnNsPp1.jpg',
      year: 1994,
      rating: 8.9,
    },
    {
      id: 5,
      title: 'The Godfather',
      poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      year: 1972,
      rating: 9.2,
    },
    {
      id: 6,
      title: 'Interstellar',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      year: 2014,
      rating: 8.6,
    },
  ]

  const recommendations = [
    {
      id: 7,
      title: 'Blade Runner 2049',
      poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
      year: 2017,
      rating: 8.0,
      genre: 'Sci-Fi',
    },
    {
      id: 8,
      title: 'The Departed',
      poster: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yXQpzJBWRIvHYPLT.jpg',
      year: 2006,
      rating: 8.5,
      genre: 'Drama',
    },
    {
      id: 9,
      title: 'John Wick',
      poster: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Pd8.jpg',
      year: 2014,
      rating: 7.4,
      genre: 'Action',
    },
  ]

  // Handler functions
  const handleProfileEdit = () => {
    setIsEditingProfile(true)
  }

  const handleSettingsToggle = () => {
    setIsEditingSettings(!isEditingSettings)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSettingsFormChange = (e) => {
    const { name, value } = e.target
    setSettingsForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    setUserData((prev) => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio,
      profilePicture: editForm.profilePicture,
      location: editForm.location,
      socialLinks: {
        twitter: editForm.twitter,
        instagram: editForm.instagram,
      },
    }))
    setIsEditingProfile(false)
  }

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to an API
    setUserData((prev) => ({
      ...prev,
      email: settingsForm.email,
    }))
    setSettingsForm((prev) => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
    setIsEditingSettings(false)
  }

  // Bio edit handler
  const handleBioSubmit = (e) => {
    e.preventDefault()
    setUserData((prev) => ({
      ...prev,
      bio: bioText,
    }))
    setIsEditingBio(false)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-bold">User Profile</h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Container 1: User Info & Profile */}
          <div className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden border border-[#2a2a2a]">
            <div className="bg-[#212121] px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white">
                Profile Information
              </h2>
            </div>

            <div className="p-6">
              {isEditingProfile ? (
                // Edit profile form
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-[#5ccfee]">
                      <img
                        src={editForm.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        type="text"
                        name="profilePicture"
                        value={editForm.profilePicture}
                        onChange={handleEditFormChange}
                        className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditFormChange}
                      className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={editForm.twitter}
                      onChange={handleEditFormChange}
                      className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={editForm.instagram}
                      onChange={handleEditFormChange}
                      className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black font-semibold rounded-lg transition duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                // Profile display
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-[#5ccfee]">
                      <img
                        src={userData.profilePicture}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{userData.name}</h3>
                    <p className="text-gray-400 mb-4">{userData.location}</p>

                    <button
                      onClick={handleProfileEdit}
                      className="inline-flex items-center px-4 py-2 bg-[#252525] hover:bg-[#333] rounded-lg transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">
                        Social Media
                      </h4>
                      <div className="flex space-x-4">
                        <a
                          href="#"
                          className="text-[#5ccfee] hover:underline flex items-center"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                          </svg>
                          {userData.socialLinks.twitter}
                        </a>
                        <a
                          href="#"
                          className="text-[#5ccfee] hover:underline flex items-center"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                          {userData.socialLinks.instagram}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Settings Button */}
                  <div className="mt-8 pt-4 border-t border-[#2a2a2a]">
                    <button
                      onClick={handleSettingsToggle}
                      className="flex items-center text-gray-300 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
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

                  {/* Settings Form */}
                  {isEditingSettings && (
                    <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                      <h4 className="text-lg font-semibold mb-4">
                        Account Settings
                      </h4>
                      <form
                        onSubmit={handleSettingsSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={settingsForm.email}
                            onChange={handleSettingsFormChange}
                            className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={settingsForm.currentPassword}
                            onChange={handleSettingsFormChange}
                            className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={settingsForm.newPassword}
                            onChange={handleSettingsFormChange}
                            className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={settingsForm.confirmPassword}
                            onChange={handleSettingsFormChange}
                            className="w-full bg-[#252525] text-white px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee]"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingSettings(false)}
                            className="px-4 py-2 bg-[#333] hover:bg-[#444] rounded-lg transition duration-200"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black font-semibold rounded-lg transition duration-200"
                          >
                            Update Settings
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Container 2: About & Stats */}
          <div className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden border border-[#2a2a2a]">
            <div className="bg-[#212121] px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white">About & Stats</h2>
            </div>

            <div className="p-6">
              {/* About Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">About</h3>
                  {!isEditingBio && (
                    <button
                      onClick={() => setIsEditingBio(true)}
                      className="text-sm text-[#5ccfee] hover:text-[#4ab3d3]"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingBio ? (
                  <form onSubmit={handleBioSubmit} className="space-y-3">
                    <textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="w-full h-32 bg-[#252525] text-white p-3 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#5ccfee] resize-none"
                      placeholder="Write something about yourself..."
                    ></textarea>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingBio(false)
                          setBioText(userData.bio)
                        }}
                        className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded-lg text-sm transition duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#5ccfee] hover:bg-[#4ab3d3] text-black font-semibold rounded-lg text-sm transition duration-200"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-gray-300 leading-relaxed">
                    {userData.bio}
                  </p>
                )}
              </div>

              {/* Stats Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Stats</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#252525] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Movies Watched</p>
                        <p className="text-2xl font-bold">
                          {userData.stats.moviesWatched}
                        </p>
                      </div>
                      <div className="bg-[#333] p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#5ccfee]"
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
                    </div>
                  </div>

                  <div className="bg-[#252525] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Movies Liked</p>
                        <p className="text-2xl font-bold">
                          {userData.stats.moviesLiked}
                        </p>
                      </div>
                      <div className="bg-[#333] p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#5ccfee]"
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
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#252525] p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Watchlist</p>
                        <p className="text-2xl font-bold">
                          {userData.stats.watchlistCount}
                        </p>
                      </div>
                      <div className="bg-[#333] p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-[#5ccfee]"
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Favorite Genres */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-3">
                    Favorite Genres
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.favoriteGenres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#5ccfee] bg-opacity-20 text-[#5ccfee] rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Container 3: Collection & Recommendations */}
          <div className="bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden border border-[#2a2a2a]">
            <div className="bg-[#212121] px-6 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white">Your Collections</h2>
            </div>

            <div className="p-6">
              {/* Tabs for Liked Movies and Watchlist */}
              <div className="mb-6 border-b border-[#2a2a2a]">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                  <li className="mr-2">
                    <button
                      onClick={() => setActiveTab('liked')}
                      className={`inline-block p-4 rounded-t-lg border-b-2 ${
                        activeTab === 'liked'
                          ? 'border-[#5ccfee] text-[#5ccfee]'
                          : 'border-transparent hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      Liked Movies
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      onClick={() => setActiveTab('watchlist')}
                      className={`inline-block p-4 rounded-t-lg border-b-2 ${
                        activeTab === 'watchlist'
                          ? 'border-[#5ccfee] text-[#5ccfee]'
                          : 'border-transparent hover:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      Watchlist
                    </button>
                  </li>
                </ul>
              </div>

              {/* Liked Movies */}
              <div className={activeTab === 'liked' ? '' : 'hidden'}>
                <h3 className="text-lg font-semibold mb-4">Liked Movies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {likedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex bg-[#252525] rounded-lg overflow-hidden"
                    >
                      <div className="w-1/3 min-w-[80px]">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3 flex flex-col">
                        <h4 className="font-semibold text-white mb-1">
                          {movie.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-1">
                          {movie.year}
                        </p>
                        <div className="flex items-center mt-auto">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-sm">
                            {movie.rating}
                          </span>

                          <button className="ml-auto text-red-500 hover:text-red-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watchlist */}
              <div className={activeTab === 'watchlist' ? '' : 'hidden'}>
                <h3 className="text-lg font-semibold mb-4">Watchlist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  {watchlist.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex bg-[#252525] rounded-lg overflow-hidden"
                    >
                      <div className="w-1/3 min-w-[80px]">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-2/3 p-3 flex flex-col">
                        <h4 className="font-semibold text-white mb-1">
                          {movie.title}
                        </h4>
                        <p className="text-gray-400 text-sm mb-1">
                          {movie.year}
                        </p>
                        <div className="flex items-center mt-auto">
                          <svg
                            className="w-4 h-4 text-yellow-400 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-white text-sm">
                            {movie.rating}
                          </span>

                          <button className="ml-auto text-gray-400 hover:text-gray-300">
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

              {/* Recommendations */}
              <div className="mt-8 pt-6 border-t border-[#2a2a2a]">
                <h3 className="text-lg font-semibold mb-4">
                  Recommended For You
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Based on your favorite genres:{' '}
                  {userData.favoriteGenres.join(', ')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
                  {recommendations.map((movie) => (
                    <div
                      key={movie.id}
                      className="bg-[#252525] rounded-lg overflow-hidden"
                    >
                      <div className="relative pb-[150%]">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-yellow-400 text-xs font-bold px-2 py-1 rounded">
                          {movie.rating}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                          <h4 className="font-semibold text-white">
                            {movie.title}
                          </h4>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300 text-xs">
                              {movie.year}
                            </p>
                            <span className="text-xs px-2 py-0.5 bg-[#5ccfee] bg-opacity-20 text-[#5ccfee] rounded-full">
                              {movie.genre}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 flex space-x-1">
                        <button className="flex-1 text-xs text-center py-1 rounded-sm bg-[#1d1d1d] hover:bg-[#333] text-gray-300">
                          + Watchlist
                        </button>
                        <button className="flex-1 text-xs text-center py-1 rounded-sm bg-[#1d1d1d] hover:bg-[#333] text-gray-300">
                          Like
                        </button>
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
  )
}

export default User
