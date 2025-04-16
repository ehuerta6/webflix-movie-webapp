import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import placeholderImg from '../assets/profile-pic.jpg'

function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setMovies(generateMovieData(24))
      setLoading(false)
    }, 1000)
  }, [])

  // Generate mock movie data
  const generateMovieData = (count) => {
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
    const movieTitles = [
      'The Last Journey',
      'Eternal Sunshine',
      'Dark Knight',
      'Lost in Space',
      'The Great Adventure',
      'Red Horizon',
      'Whispers in the Dark',
      'Frozen Heart',
      'Lightning Strike',
      'Silent Echo',
      'Through the Fire',
      'Midnight Hour',
      'Brave New World',
      'Golden Age',
      'Beyond the Stars',
      'The Secret Door',
    ]

    return Array.from({ length: count }, (_, i) => ({
      id: `movie-${i}`,
      type: 'movie',
      title:
        movieTitles[i % movieTitles.length] +
        (i > movieTitles.length
          ? ` ${Math.floor(i / movieTitles.length) + 1}`
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
          <p className="text-gray-400">Loading movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12 pt-6">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-medium text-white mb-2">
            Movies
          </h1>
          <p className="text-gray-400">
            Discover the latest and greatest in cinema
          </p>
        </div>

        {/* Filters - Could be expanded in the future */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-[#1e1e1e] text-white hover:bg-[#2a2a2a] rounded-full text-sm font-medium transition-colors">
            All
          </button>
          <button className="px-4 py-2 bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white rounded-full text-sm font-medium transition-colors">
            Action
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
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Movies
