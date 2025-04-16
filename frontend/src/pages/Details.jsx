import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'

// Mock data for cast members
const mockCast = [
  {
    id: 'cast-1',
    name: 'Actor Name 1',
    character: 'Character 1',
    profile: null,
  },
  {
    id: 'cast-2',
    name: 'Actor Name 2',
    character: 'Character 2',
    profile: null,
  },
  {
    id: 'cast-3',
    name: 'Actor Name 3',
    character: 'Character 3',
    profile: null,
  },
  {
    id: 'cast-4',
    name: 'Actor Name 4',
    character: 'Character 4',
    profile: null,
  },
  {
    id: 'cast-5',
    name: 'Actor Name 5',
    character: 'Character 5',
    profile: null,
  },
]

function Details() {
  const { id, type } = useParams() // type will be either 'movie' or 'tv'
  const [details, setDetails] = useState(null)
  const [similarContent, setSimilarContent] = useState([])
  const [cast, setCast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we would fetch data based on the id and type
    // For now, we'll use mock data
    setTimeout(() => {
      // Simulate fetching details data
      setDetails({
        id: id || 'movie-1',
        title: 'The Spectacular Journey',
        tagline: 'Discover the unknown',
        poster: null,
        backdrop: null,
        rating: '8.7',
        description:
          'An epic adventure that follows a group of explorers who discover a hidden world with breathtaking landscapes and mysterious creatures. As they delve deeper into this uncharted territory, they uncover ancient secrets that challenge everything they know about reality.',
        year: '2023',
        runtime: 142, // in minutes
        genres: ['Adventure', 'Fantasy', 'Sci-Fi'],
        director: 'Director Name',
        budget: '$150,000,000',
        revenue: '$320,000,000',
        status: 'Released',
        language: 'English',
        productionCompanies: ['Studio A', 'Productions B'],
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      })

      // Simulate fetching cast data
      setCast(mockCast)

      // Simulate fetching similar content
      setSimilarContent(generateSimilarContent(6))

      setLoading(false)
    }, 1000)
  }, [id, type])

  // Generate similar movies/shows
  const generateSimilarContent = (count) => {
    const genres = [
      'Action',
      'Drama',
      'Comedy',
      'Sci-Fi',
      'Horror',
      'Romance',
      'Thriller',
      'Fantasy',
    ]
    const years = ['2023', '2022', '2021', '2020', '2024']

    return Array.from({ length: count }, (_, i) => ({
      id: `similar-${i}`,
      title: `Similar Title ${i + 1}`,
      poster: null,
      rating: (Math.random() * 5 + 5).toFixed(1),
      genre: genres[Math.floor(Math.random() * genres.length)],
      year: years[Math.floor(Math.random() * years.length)],
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="w-full h-[60vh] relative">
          {/* Backdrop Image */}
          <img
            src={details.backdrop ? details.backdrop : placeholderImg}
            alt={details.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = placeholderImg
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#12121299] to-[#12121233]"></div>

          {/* Back Button */}
          <Link
            to="/"
            className="absolute top-4 left-4 z-10 flex items-center gap-1 text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>←</span> Back
          </Link>
        </div>

        {/* Movie Details Card - Overlapping the hero section */}
        <div className="relative -mt-56 z-10 mx-auto max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="w-[200px] md:w-[300px] shrink-0 mx-auto md:mx-0">
              <img
                src={details.poster ? details.poster : placeholderImg}
                alt={details.title}
                className="w-full aspect-[2/3] object-cover rounded-md shadow-lg"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = placeholderImg
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl md:text-4xl text-white font-medium">
                  {details.title}
                </h1>
                <span className="text-gray-400 text-lg">{details.year}</span>
              </div>

              {/* Tagline */}
              {details.tagline && (
                <p className="text-[#5ccfee] italic mt-1">
                  "{details.tagline}"
                </p>
              )}

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mt-3">
                {details.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 bg-[#1e1e1e] text-white text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <div className="bg-[#1e1e1e] px-2.5 py-1.5 rounded flex items-center gap-1.5">
                  <span className="text-[#5ccfee]">★</span>
                  <span className="text-white font-medium">
                    {details.rating}
                  </span>
                  <span className="text-gray-400 text-sm">/10</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              </div>

              {/* Overview */}
              <div className="mt-5">
                <h2 className="text-xl text-white mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {details.description}
                </p>
              </div>

              {/* Director and other details */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Director:</span>{' '}
                  <span className="text-white">{details.director}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>{' '}
                  <span className="text-white">{details.status}</span>
                </div>
                <div>
                  <span className="text-gray-400">Language:</span>{' '}
                  <span className="text-white">{details.language}</span>
                </div>
                <div>
                  <span className="text-gray-400">Budget:</span>{' '}
                  <span className="text-white">{details.budget}</span>
                </div>
                <div>
                  <span className="text-gray-400">Revenue:</span>{' '}
                  <span className="text-white">{details.revenue}</span>
                </div>
                <div>
                  <span className="text-gray-400">Production:</span>{' '}
                  <span className="text-white">
                    {details.productionCompanies.join(', ')}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <a
                  href={details.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-button flex items-center gap-1.5"
                >
                  <span>▶</span> Watch Trailer
                </a>
                <button className="secondary-button">+ Add to Watchlist</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="max-w-screen-xl mx-auto px-4 mt-12">
        <h2 className="text-xl text-white mb-4">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cast.map((person) => (
            <div
              key={person.id}
              className="bg-[#1e1e1e] rounded overflow-hidden"
            >
              <div className="aspect-[2/3]">
                <img
                  src={person.profile ? person.profile : placeholderImg}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = placeholderImg
                  }}
                />
              </div>
              <div className="p-2">
                <h3 className="text-white text-sm font-medium">
                  {person.name}
                </h3>
                <p className="text-gray-400 text-xs">{person.character}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Content */}
      <div className="max-w-screen-xl mx-auto px-4 mt-12">
        <h2 className="text-xl text-white mb-4">Similar Content</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {similarContent.map((item) => (
            <div
              key={item.id}
              className="bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={item.poster ? item.poster : placeholderImg}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = placeholderImg
                  }}
                />
                <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
                  <span className="text-[#5ccfee]">{item.rating}</span>
                </div>

                {/* Genre badge */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5ccfee] font-medium">
                      {item.genre}
                    </span>
                    <span className="text-xs text-gray-300">{item.year}</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <h3 className="text-sm text-gray-200 font-medium truncate">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Details
