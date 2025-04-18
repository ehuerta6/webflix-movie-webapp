import { useState, memo } from 'react'
import { Link } from 'react-router-dom'

const MovieCard = memo(function MovieCard({ movie }) {
  const { id, type = 'movie', title, poster, rating, genre, year } = movie
  const [imageLoaded, setImageLoaded] = useState(false)

  // If there's no poster, don't render the card
  if (!poster) return null

  return (
    <Link
      to={`/${type}/${id}`}
      className="block bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer h-full"
    >
      <div className="aspect-[2/3] relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#333] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={poster}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        {rating && (
          <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
            <span className="text-[#5ccfee]">{rating}</span>
          </div>
        )}

        {/* Genre badge */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            {genre && (
              <span className="text-xs text-[#5ccfee] font-medium">
                {genre}
              </span>
            )}
            {year && <span className="text-xs text-gray-300">{year}</span>}
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm text-gray-200 font-medium truncate">{title}</h3>
      </div>
    </Link>
  )
})

export default MovieCard
