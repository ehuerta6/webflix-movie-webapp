// API service for TMDB movie data
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_API_BASE_URL
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

/**
 * Fetch data from the TMDB API
 * @param {string} endpoint - The API endpoint to fetch
 * @param {Object} params - Additional query parameters
 * @returns {Promise<Object>} The API response data
 */
async function fetchFromAPI(endpoint, params = {}) {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...params,
    }).toString()

    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error)
    return null
  }
}

/**
 * Fetch trending movies and TV shows
 * @param {string} mediaType - 'movie', 'tv', or 'all'
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise<Object>} The trending results
 */
export const fetchTrending = async (mediaType = 'all', timeWindow = 'week') => {
  const data = await fetchFromAPI(`/trending/${mediaType}/${timeWindow}`)
  return data || { results: [] }
}

/**
 * Fetch details for a movie or TV show
 * @param {string} type - 'movie' or 'tv'
 * @param {number} id - Item ID
 * @returns {Promise<Object>} Item details
 */
export const fetchMediaDetails = async (type, id) => {
  return await fetchFromAPI(`/${type}/${id}`, {
    append_to_response: 'credits,similar,videos',
  })
}

/**
 * Fetch movie details by ID
 * @param {number} id - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const fetchMovieDetails = async (id) => {
  return await fetchMediaDetails('movie', id)
}

/**
 * Fetch TV show details by ID
 * @param {number} id - TV show ID
 * @returns {Promise<Object>} TV show details
 */
export const fetchShowDetails = async (id) => {
  return await fetchMediaDetails('tv', id)
}

/**
 * Fetch media with filters
 * @param {string} type - 'movie' or 'tv'
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @returns {Promise<Object>} Filtered results with pagination info
 */
export const fetchMedia = async (type, filters = {}, page = 1) => {
  const data = await fetchFromAPI(`/discover/${type}`, { page, ...filters })
  return data || { results: [], total_pages: 0, total_results: 0, page }
}

/**
 * Fetch movies with filters
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @returns {Promise<Object>} Filtered movie results with pagination info
 */
export const fetchMovies = async (filters = {}, page = 1) => {
  return await fetchMedia('movie', filters, page)
}

/**
 * Fetch TV shows with filters
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @returns {Promise<Object>} Filtered TV show results with pagination info
 */
export const fetchShows = async (filters = {}, page = 1) => {
  return await fetchMedia('tv', filters, page)
}

/**
 * Fetch movie and TV genres
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Array>} Genres list
 */
export const fetchGenres = async (type = 'movie') => {
  const data = await fetchFromAPI(`/genre/${type}/list`)
  return data?.genres || []
}

/**
 * Search for movies, TV shows, or both
 * @param {string} query - Search term
 * @param {string} type - 'movie', 'tv', or 'multi'
 * @param {number} page - Page number
 * @returns {Promise<Object>} Search results
 */
export const searchMedia = async (query, type = 'multi', page = 1) => {
  if (!query) return { results: [] }

  const data = await fetchFromAPI(`/search/${type}`, {
    query: encodeURIComponent(query),
    page,
  })

  return data || { results: [] }
}

/**
 * Search TMDB API for movies, TV shows, and people
 * @param {string} query - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} Formatted search results with pagination info
 */
export const searchTMDB = async (query, page = 1) => {
  return await searchMedia(query, 'multi', page)
}

/**
 * Search for content by genre ID
 * @param {number} genreId - The genre ID to search for
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {number} page - Page number
 * @returns {Promise<Object>} Content with the specified genre, with pagination info
 */
export const searchByGenre = async (genreId, mediaType = 'movie', page = 1) => {
  if (!genreId) return { results: [] }

  return await fetchMedia(mediaType, { with_genres: genreId }, page)
}

/**
 * Fetch person details by ID
 * @param {number} id - Person ID
 * @returns {Promise<Object>} Person details
 */
export const fetchPersonDetails = async (id) => {
  return await fetchFromAPI(`/person/${id}`, {
    append_to_response: 'combined_credits',
  })
}

/**
 * Generate proper TMDB image URLs
 * @param {string} path - The image path from TMDB
 * @param {string} size - The size of the image (w500, original, etc.)
 * @returns {string|null} - Full image URL or fallback image if path is invalid
 */
export const getTMDBImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `${IMAGE_BASE_URL}/${size}${path}`
}
