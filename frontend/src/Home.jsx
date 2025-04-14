import { useState, useEffect } from 'react'
import placeholderImg from './assets/profile-pic.jpg'

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
        title: 'The Spectacular Journey',
        poster: null, // Will use placeholder
        backdrop: null, // Will use placeholder
        rating: '8.7',
        description:
          'An epic adventure that follows a group of explorers who discover a hidden world with breathtaking landscapes and mysterious creatures. As they delve deeper into this uncharted territory, they uncover ancient secrets that challenge everything they know about reality.',
        year: '2023',
        genres: ['Adventure', 'Fantasy', 'Sci-Fi'],
      })
      setInTheaters(generatePlaceholderData('In Theaters', 6))
      setPopular(generatePlaceholderData('Popular', 6))
      setTopRatedMovies(generatePlaceholderData('Top Movies', 6))
      setTopRatedShows(generatePlaceholderData('Top Shows', 6))
      setLoading(false)
    }, 1000)
  }, [])

  // Helper function to generate placeholder data
  const generatePlaceholderData = (category, count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${category.toLowerCase().replace(' ', '-')}-${i}`,
      title: `${category} Title ${i + 1}`,
      poster: Math.random() > 0.3 ? null : 'some-url.jpg', // 70% chance of missing poster
      rating: (Math.random() * 5 + 5).toFixed(1), // Random rating between 5.0 and 10.0
    }))
  }

  // Featured component for the main highlight
  const Featured = ({ movie }) => (
    <section className="relative mb-12 overflow-hidden rounded-lg shadow-xl">
      <div className="w-full h-[500px] relative">
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>

        {/* Background image */}
        <img
          src={movie.backdrop ? movie.backdrop : placeholderImg}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Poster */}
            <div className="w-32 md:w-48 shrink-0 rounded-md overflow-hidden shadow-lg hidden md:block">
              <img
                src={movie.poster ? movie.poster : placeholderImg}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <span className="text-yellow-400 font-bold bg-black/50 px-2 py-1 rounded-md">
                  {movie.rating}
                </span>
              </div>

              <div className="text-gray-300 mb-3">
                <span>{movie.year}</span>
                <span className="mx-2">•</span>
                <span>{movie.genres.join(', ')}</span>
              </div>

              <p className="text-white text-lg max-w-2xl mb-4">
                {movie.description}
              </p>

              <div className="flex gap-3 mt-4">
                <button className="bg-[#00b7eb] text-white font-bold py-3 px-6 rounded-md hover:bg-[#0099c7] transition-colors">
                  ▶ Watch Now
                </button>
                <button className="bg-transparent border border-white text-white font-bold py-3 px-6 rounded-md hover:bg-white/10 transition-colors">
                  + Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  // Section component for code reuse
  const Section = ({ title, items }) => (
    <section className="mt-12 mb-8">
      <div className="bg-[#1a1a2e] py-3 px-6 mb-6 rounded-sm shadow-md">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={item.poster ? item.poster : placeholderImg}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-black bg-opacity-70 px-2 py-1 m-1 rounded">
                  <span className="text-yellow-400 text-sm font-bold">
                    {item.rating}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold truncate">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <p className="text-2xl">Loading awesome content...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-10">
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
