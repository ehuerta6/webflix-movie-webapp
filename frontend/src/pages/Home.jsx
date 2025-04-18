import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'
import MovieCard from '../components/MovieCard'
import { fetchTrending, fetchMovies, fetchShows } from '../services/api'

function Home() {
  // State for different movie/show categories
  const [featured, setFeatured] = useState(null)
  const [inTheaters, setInTheaters] = useState([])
  const [popular, setPopular] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [topRatedShows, setTopRatedShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Format movie data to be consistent with MovieCard component
  const formatMovieData = (movie) => ({
    id: movie.id,
    type: movie.media_type || 'movie',
    title: movie.title || movie.name,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    backdrop: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    rating: movie.vote_average.toFixed(1),
    genre: movie.genre_ids
      ? getGenreNames(movie.genre_ids)[0] || 'Unknown'
      : 'Unknown',
    year:
      movie.release_date || movie.first_air_date
        ? (movie.release_date || movie.first_air_date).substring(0, 4)
        : 'Unknown',
    description: movie.overview,
    genres: getGenreNames(movie.genre_ids),
  })

  // Helper function to convert genre IDs to names
  // This is a simplified version since we don't have the full genre list here
  const getGenreNames = (genreIds = []) => {
    // Common genre map (simplified)
    const genreMap = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
      10759: 'Action & Adventure',
      10762: 'Kids',
      10763: 'News',
      10764: 'Reality',
      10765: 'Sci-Fi & Fantasy',
      10766: 'Soap',
      10767: 'Talk',
      10768: 'War & Politics',
    }

    return genreIds
      ? genreIds
          .map((id) => genreMap[id] || 'Unknown')
          .filter((name) => name !== 'Unknown')
      : []
  }

  // Fetch data from API
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch trending content for featured section and popular section
        const trendingData = await fetchTrending('all', 'day')

        if (trendingData.results && trendingData.results.length > 0) {
          // Use the first trending item as featured content
          const featuredItem = trendingData.results[0]
          setFeatured(formatMovieData(featuredItem))

          // Use other trending items for the "What's Popular" section
          const formattedPopular = trendingData.results
            .slice(1, 7)
            .map((item) => formatMovieData(item))
          setPopular(formattedPopular)
        }

        // Fetch in theaters (recent & upcoming movies)
        const theatersData = await fetchMovies({
          sort_by: 'primary_release_date.desc',
          'primary_release_date.lte': new Date().toISOString().split('T')[0],
          'primary_release_date.gte': new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split('T')[0],
        })

        if (theatersData.results) {
          const formattedTheaters = theatersData.results
            .slice(0, 6)
            .map((movie) => formatMovieData({ ...movie, media_type: 'movie' }))
          setInTheaters(formattedTheaters)
        }

        // Fetch top rated movies
        const topMoviesData = await fetchMovies({
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
        })

        if (topMoviesData.results) {
          const formattedTopMovies = topMoviesData.results
            .slice(0, 6)
            .map((movie) => formatMovieData({ ...movie, media_type: 'movie' }))
          setTopRatedMovies(formattedTopMovies)
        }

        // Fetch top rated TV shows
        const topShowsData = await fetchShows({
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
        })

        if (topShowsData.results) {
          const formattedTopShows = topShowsData.results
            .slice(0, 6)
            .map((show) => formatMovieData({ ...show, media_type: 'tv' }))
          setTopRatedShows(formattedTopShows)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching home page data:', err)
        setError('Failed to load content. Please try again later.')
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

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
                • {movie.genres && movie.genres.join(', ')}
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
            <MovieCard key={item.id} movie={item} />
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="flex flex-col items-center">
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#5ccfee] text-black rounded hover:bg-[#4ab9d9]"
          >
            Retry
          </button>
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
