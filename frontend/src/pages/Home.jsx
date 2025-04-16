import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'

function Home() {
  // State for different movie/show categories
  const [featured, setFeatured] = useState(null)
  const [inTheaters, setInTheaters] = useState([])
  const [popular, setPopular] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [topRatedShows, setTopRatedShows] = useState([])
  const [loading, setLoading] = useState(true)

  // Placeholder data for each section - in a real app, this would come from an API
  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setFeatured({
        id: 'featured-movie',
        type: 'movie',
        title: 'The Spectacular Journey',
        poster: null, // Will use placeholder
        backdrop: null, // Will use placeholder
        rating: '8.7',
        description:
          'An epic adventure that follows a group of explorers who discover a hidden world with breathtaking landscapes and mysterious creatures. As they delve deeper into this uncharted territory, they uncover ancient secrets that challenge everything they know about reality.',
        year: '2023',
        genres: ['Adventure', 'Fantasy', 'Sci-Fi'],
      })
      setInTheaters(generatePlaceholderData('In Theaters', 6, 'movie'))
      setPopular(generatePlaceholderData('Popular', 6, 'movie'))
      setTopRatedMovies(generatePlaceholderData('Top Movies', 6, 'movie'))
      setTopRatedShows(generatePlaceholderData('Top Shows', 6, 'tv'))
      setLoading(false)
    }, 1000)
  }, [])

  // Helper function to generate placeholder data
  const generatePlaceholderData = (category, count, type = 'movie') => {
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
      id: `${category.toLowerCase().replace(' ', '-')}-${i}`,
      type: type, // 'movie' or 'tv'
      title: `${category} Title ${i + 1}`,
      poster: Math.random() > 0.3 ? null : 'some-url.jpg', // 70% chance of missing poster
      rating: (Math.random() * 5 + 5).toFixed(1), // Random rating between 5.0 and 10.0
      genre: genres[Math.floor(Math.random() * genres.length)],
      year: years[Math.floor(Math.random() * years.length)],
    }))
  }

  // Featured component for the main highlight
  const Featured = ({ movie }) => (
    <section className="relative mb-10">
      <div className="w-full h-[400px] md:h-[450px] relative">
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent z-10"></div>

        {/* Background image */}
        <img
          src={movie.backdrop ? movie.backdrop : placeholderImg}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = placeholderImg
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-20">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-1">
              <span className="rating-badge">{movie.rating}</span>
              <span className="text-gray-400 text-sm">{movie.year}</span>
              <span className="text-gray-400 text-sm hidden sm:inline">
                • {movie.genres.join(', ')}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-white mb-2">
              {movie.title}
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mb-4 line-clamp-3 md:line-clamp-none">
              {movie.description}
            </p>

            <div className="flex gap-3 mt-3">
              <Link
                to={`/${movie.type}/${movie.id}`}
                className="primary-button flex items-center gap-1 cursor-pointer"
              >
                <span>▶</span> Watch
              </Link>
              <button className="secondary-button cursor-pointer">
                Add to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Section component for code reuse
  const Section = ({ title, items }) => (
    <section className="mb-10">
      <h2 className="text-lg md:text-xl font-medium text-white mb-4 px-4 md:px-6">
        {title}
      </h2>
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/${item.type}/${item.id}`}
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  )

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
    <div className="bg-[#121212] min-h-screen pb-8">
      <div className="w-full mx-auto">
        {featured && <Featured movie={featured} />}

        <div className="max-w-screen-xl mx-auto">
          <Section title="In Theaters" items={inTheaters} />
          <Section title="What's Popular" items={popular} />
          <Section title="Top Rated Movies" items={topRatedMovies} />
          <Section title="Top Rated Shows" items={topRatedShows} />
        </div>
      </div>
    </div>
  )
}

export default Home
