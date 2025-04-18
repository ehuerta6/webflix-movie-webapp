import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchMovieDetails, fetchShowDetails } from '../services/api'

// Helper function with simplified content validation
const isValidContent = (item) => {
  if (!item) return false

  const hasBasics =
    (item.title || item.name) &&
    // Require poster_path for all content
    item.poster_path &&
    item.overview?.trim() &&
    item.vote_average > 0

  // For similar content, only basic validation
  if (item.belongs_to_collection || item.similar) return hasBasics

  // Type-specific validation
  if (item.media_type === 'movie' || !item.media_type) {
    return hasBasics && item.release_date?.trim()
  }

  if (item.media_type === 'tv') {
    return (
      hasBasics &&
      item.first_air_date?.trim() &&
      (item.number_of_episodes !== undefined ||
        item.number_of_seasons !== undefined)
    )
  }

  return hasBasics
}

// Common genre map used for ID to name conversion
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

// Extract trailer URL helper function
const getTrailerUrl = (videos) => {
  if (!videos?.results?.length) return null

  const trailer =
    videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.results[0]

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}

// Content Card component for reuse
const ContentCard = ({ item, type }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Skip rendering if no poster
  if (!item.poster) return null

  return (
    <Link
      to={`/${type}/${item.id}`}
      className="w-36 flex-shrink-0 bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200"
    >
      <div className="aspect-[2/3] relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#333] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={item.poster}
          alt={item.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
          <span className="text-[#5ccfee]">{item.rating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5ccfee] font-medium truncate max-w-[70%]">
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
  )
}

// Cast Card component for reuse
const CastCard = ({ person }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Skip rendering if no profile image
  if (!person.profile) return null

  return (
    <div className="w-32 flex-shrink-0 bg-[#1e1e1e] rounded overflow-hidden">
      <div className="w-full h-40 overflow-hidden relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#333] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={person.profile}
          alt={person.name}
          className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <h3 className="text-white text-sm font-medium truncate">
          {person.name}
        </h3>
        <p className="text-gray-400 text-xs truncate">{person.character}</p>
      </div>
    </div>
  )
}

function Details() {
  const { id, type } = useParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [similarContent, setSimilarContent] = useState([])
  const [cast, setCast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Image loading states
  const [backdropLoaded, setBackdropLoaded] = useState(false)
  const [posterLoaded, setPosterLoaded] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch details based on content type
        const fetchFunction =
          type === 'movie' ? fetchMovieDetails : fetchShowDetails
        const data = await fetchFunction(id)

        if (!data || data.status_code === 34) {
          setError(`${type === 'movie' ? 'Movie' : 'TV show'} not found`)
          setLoading(false)
          return
        }

        if (!isValidContent(data)) {
          setError(
            `This ${type} has incomplete information and cannot be displayed`
          )
          setLoading(false)
          return
        }

        // Format details for our component
        const formattedDetails = {
          id: data.id,
          title: data.title || data.name,
          tagline: data.tagline || '',
          poster: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : null,
          backdrop: data.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : null,
          rating: data.vote_average.toFixed(1),
          description: data.overview,
          year:
            (data.release_date || data.first_air_date)?.substring(0, 4) ||
            'Unknown',
          runtime:
            data.runtime || (data.episode_run_time && data.episode_run_time[0]),
          genres: data.genres?.map((genre) => genre.name) || [],
          status: data.status,
          language: data.original_language,
          budget: data.budget ? `$${data.budget.toLocaleString()}` : 'N/A',
          revenue: data.revenue ? `$${data.revenue.toLocaleString()}` : 'N/A',
          productionCompanies:
            data.production_companies?.map((company) => company.name) || [],
          trailer: getTrailerUrl(data.videos),
          number_of_seasons: data.number_of_seasons,
          number_of_episodes: data.number_of_episodes,
        }

        setDetails(formattedDetails)

        // Extract cast information
        if (data.credits?.cast?.length) {
          const formattedCast = data.credits.cast
            .slice(0, 10)
            .map((person) => ({
              id: person.id,
              name: person.name,
              character: person.character,
              profile: person.profile_path
                ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                : null,
            }))

          setCast(formattedCast)

          // Preload cast profile images
          const profileUrls = formattedCast
            .map((person) => person.profile)
            .filter(Boolean)

          if (profileUrls.length) {
            // Start preloading in background
            import('../services/api').then((api) => {
              api.preloadImages(profileUrls).catch(() => {}) // Ignore preload errors
            })
          }
        }

        // Extract similar content
        if (data.similar?.results?.length) {
          const similar = data.similar.results
            .filter(
              (item) =>
                (item.title || item.name) &&
                item.poster_path &&
                item.overview?.trim() &&
                item.vote_average > 0
            )
            .slice(0, 15)
            .map((item) => ({
              id: item.id,
              title: type === 'movie' ? item.title : item.name,
              poster: item.poster_path
                ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                : null,
              rating: item.vote_average?.toFixed(1) || 'N/A',
              year:
                type === 'movie'
                  ? item.release_date
                    ? item.release_date.split('-')[0]
                    : 'N/A'
                  : item.first_air_date
                  ? item.first_air_date.split('-')[0]
                  : 'N/A',
              genre: item.genre_ids?.length
                ? genreMap[item.genre_ids[0]] || 'N/A'
                : 'N/A',
            }))

          setSimilarContent(similar)

          // Preload similar content poster images
          const posterUrls = similar.map((item) => item.poster).filter(Boolean)

          if (posterUrls.length) {
            // Start preloading in background
            import('../services/api').then((api) => {
              api.preloadImages(posterUrls).catch(() => {}) // Ignore preload errors
            })
          }
        }
      } catch (err) {
        console.error('Error fetching details:', err)
        setError(`Failed to load ${type} details. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [id, type])

  // Format runtime for display
  const formatRuntime = (minutes) => {
    if (!minutes) return ''
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${minutes}m`
  }

  const handleGoBack = () => navigate(-1)

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
          <Link
            to="/"
            className="mt-4 px-4 py-2 bg-[#5ccfee] text-black rounded hover:bg-[#4ab9d9]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Only continue if we have sufficient details
  if (
    !details?.poster ||
    !details?.description ||
    !details?.year ||
    !details?.rating ||
    (type === 'movie' && !details?.runtime)
  ) {
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="flex flex-col items-center">
          <p className="text-gray-400">Content information is incomplete</p>
          <Link
            to="/"
            className="mt-4 px-4 py-2 bg-[#5ccfee] text-black rounded hover:bg-[#4ab9d9]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#121212] min-h-screen pb-12">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        <div className="w-full h-[60vh] relative">
          {details.backdrop ? (
            <>
              {!backdropLoaded && (
                <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={details.backdrop}
                alt={details.title}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  backdropLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setBackdropLoaded(true)}
                fetchPriority="high"
              />
            </>
          ) : (
            /* Gradient background as fallback */
            <div className="w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#121212]"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#12121299] to-[#12121233]"></div>
          <button
            onClick={handleGoBack}
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-md transition-colors text-sm"
          >
            <span className="text-sm">←</span> Go Back
          </button>
        </div>

        {/* Details Card */}
        <div className="relative -mt-56 z-10 mx-auto max-w-screen-xl px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="w-[200px] md:w-[300px] shrink-0 mx-auto md:mx-0 relative">
              {!posterLoaded && (
                <div className="absolute inset-0 bg-[#333] flex items-center justify-center rounded-md">
                  <div className="w-10 h-10 border-3 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={details.poster}
                alt={details.title}
                className={`w-full aspect-[2/3] object-cover rounded-md shadow-lg transition-opacity duration-500 ${
                  posterLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setPosterLoaded(true)}
                loading="eager"
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

              {details.tagline && (
                <p className="text-[#5ccfee] italic mt-1 mb-4">
                  {details.tagline}
                </p>
              )}

              {/* Rating and Genres */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl text-[#5ccfee] font-semibold">
                    {details.rating}
                  </span>
                  <span className="text-sm text-gray-400">/10</span>
                </div>

                <div className="w-px h-5 bg-gray-700"></div>
                <div className="text-gray-300 text-sm">
                  {details.genres.join(', ')}
                </div>

                {type === 'movie' && details.runtime && (
                  <>
                    <div className="w-px h-5 bg-gray-700"></div>
                    <div className="text-gray-300 text-sm">
                      {formatRuntime(details.runtime)}
                    </div>
                  </>
                )}

                {type === 'tv' && (
                  <>
                    {details.number_of_seasons && (
                      <>
                        <div className="w-px h-5 bg-gray-700"></div>
                        <div className="text-gray-300 text-sm">
                          {details.number_of_seasons}{' '}
                          {details.number_of_seasons === 1
                            ? 'Season'
                            : 'Seasons'}
                        </div>
                      </>
                    )}
                    {details.number_of_episodes && (
                      <>
                        <div className="w-px h-5 bg-gray-700"></div>
                        <div className="text-gray-300 text-sm">
                          {details.number_of_episodes}{' '}
                          {details.number_of_episodes === 1
                            ? 'Episode'
                            : 'Episodes'}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-xl text-white mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed">
                  {details.description || 'No overview available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                {details.trailer && (
                  <a
                    href={details.trailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="primary-button flex items-center gap-1"
                  >
                    <span>▶</span> Watch Trailer
                  </a>
                )}
                <button className="secondary-button">Add to Watchlist</button>
                <button className="secondary-button">
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6 text-sm">
                <div>
                  <h3 className="text-gray-400 mb-1">Status</h3>
                  <p className="text-white">{details.status}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 mb-1">Original Language</h3>
                  <p className="text-white">
                    {details.language?.toUpperCase() || 'Unknown'}
                  </p>
                </div>

                {type === 'movie' && (
                  <>
                    <div>
                      <h3 className="text-gray-400 mb-1">Budget</h3>
                      <p className="text-white">{details.budget}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-400 mb-1">Revenue</h3>
                      <p className="text-white">{details.revenue}</p>
                    </div>
                  </>
                )}

                {type === 'tv' && details.number_of_seasons && (
                  <div>
                    <h3 className="text-gray-400 mb-1">First Air Date</h3>
                    <p className="text-white">{details.year}</p>
                  </div>
                )}

                <div
                  className={
                    type === 'tv' ? 'col-span-2 md:col-span-3' : 'col-span-2'
                  }
                >
                  <h3 className="text-gray-400 mb-1">Production</h3>
                  <p className="text-white">
                    {details.productionCompanies.join(', ') || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="mx-auto max-w-screen-xl px-4 mt-12">
        <h2 className="text-xl text-white mb-4">Cast</h2>
        <div className="overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex space-x-4" style={{ minWidth: 'max-content' }}>
            {cast.length > 0 ? (
              cast.map((person) => <CastCard key={person.id} person={person} />)
            ) : (
              <p className="text-gray-400">No cast information available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Content Section */}
      {similarContent.length > 0 && (
        <div className="mx-auto max-w-screen-xl px-4 mt-12">
          <h2 className="text-xl text-white mb-4">
            Recommended {type === 'movie' ? 'Movies' : 'Shows'}
          </h2>
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div
              className="flex space-x-4 scroll-smooth"
              style={{ minWidth: 'max-content' }}
            >
              {similarContent.map((item) => (
                <ContentCard key={item.id} item={item} type={type} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Details
