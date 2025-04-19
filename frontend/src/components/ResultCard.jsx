import { useState, memo } from 'react'
import { Link } from 'react-router-dom'

const ResultCard = memo(function ResultCard({ result }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!result || !result.poster) return null

  // Handle person type differently
  if (result.type === 'person') {
    return (
      <Link
        to={`/person/${result.id}`}
        className="block bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer h-full"
      >
        <div className="aspect-[2/3] relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#333] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={result.poster}
            alt={result.title || result.name}
            className={`w-full h-full object-cover object-top transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
        <div className="p-2">
          <h3 className="text-sm text-gray-200 font-medium truncate">
            {result.title || result.name}
          </h3>
          {result.known_for_department && (
            <p className="text-[#5ccfee] text-xs">
              {result.known_for_department}
            </p>
          )}
        </div>
      </Link>
    )
  }

  // Movie or TV show card
  return (
    <Link
      to={`/${result.type}/${result.id}`}
      className="block bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer h-full"
    >
      <div className="aspect-[2/3] relative">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#333] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#5ccfee] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={result.poster}
          alt={result.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        {result.rating && (
          <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
            <span className="text-[#5ccfee]">{result.rating}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            {result.genre && (
              <span className="text-xs text-[#5ccfee] font-medium truncate max-w-[70%]">
                {result.genre}
              </span>
            )}
            {result.year && (
              <span className="text-xs text-gray-300">{result.year}</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm text-gray-200 font-medium truncate">
          {result.title}
        </h3>
      </div>
    </Link>
  )
})

export default ResultCard
