import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import placeholderImg from '../assets/profile-pic.jpg'

function Shows() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setShows(generateShowData(24))
      setLoading(false)
    }, 1000)
  }, [])

  // Generate mock TV show data
  const generateShowData = (count) => {
    const genres = [
      'Drama',
      'Comedy',
      'Sci-Fi',
      'Horror',
      'Action',
      'Adventure',
      'Mystery',
      'Fantasy',
      'Thriller',
      'Crime',
    ]
    const years = ['2023', '2022', '2021', '2020', '2024']
    const showTitles = [
      'Stranger Things',
      'The Crown',
      'Breaking Bad',
      'The Mandalorian',
      'Game of Thrones',
      'The Office',
      'Dark Matter',
      'Westworld',
      'The Last of Us',
      'Black Mirror',
      'Better Call Saul',
      'The Walking Dead',
      'The Witcher',
      'Succession',
      'Euphoria',
      'The Boys',
    ]

    return Array.from({ length: count }, (_, i) => ({
      id: `show-${i}`,
      type: 'tv',
      title:
        showTitles[i % showTitles.length] +
        (i > showTitles.length
          ? ` ${Math.floor(i / showTitles.length) + 1}`
          : ''),
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
          <p className="text-gray-400">Loading shows...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12 pt-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            TV Shows
          </h1>
          <p className="text-gray-400">
            Discover the best series to binge watch
          </p>
        </div>

        {/* Filters - Could be expanded in the future */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] rounded-full text-sm font-medium transition-colors">
            All
          </button>
          <button className="px-4 py-2 bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-full text-sm font-medium transition-colors">
            Drama
          </button>
          <button className="px-4 py-2 bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-full text-sm font-medium transition-colors">
            Comedy
          </button>
          <button className="px-4 py-2 bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-full text-sm font-medium transition-colors">
            Sci-Fi
          </button>
          <button className="px-4 py-2 bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-full text-sm font-medium transition-colors">
            Crime
          </button>
        </div>

        {/* Shows Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {shows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Shows
