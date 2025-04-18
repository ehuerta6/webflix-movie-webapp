import { Link } from 'react-router-dom'
import placeholderImg from '../assets/profile-pic.jpg'

function MovieCard({ movie }) {
  const { id, type = 'movie', title, poster, rating, genre, year } = movie

  return (
    <Link
      to={`/${type}/${id}`}
      className="block bg-[#1e1e1e] rounded overflow-hidden hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer h-full"
    >
      <div className="aspect-[2/3] relative">
        <img
          src={poster ? poster : placeholderImg}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = placeholderImg
          }}
        />
        <div className="absolute top-0 right-0 bg-black/50 px-1.5 py-0.5 m-1.5 rounded text-xs">
          <span className="text-[#5ccfee]">{rating}</span>
        </div>

        {/* Genre badge */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5ccfee] font-medium">{genre}</span>
            <span className="text-xs text-gray-300">{year}</span>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm text-gray-200 font-medium truncate">{title}</h3>
      </div>
    </Link>
  )
}

export default MovieCard
