// API service for TMDB movie data
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Fetch trending movies and TV shows
 * @param {string} mediaType - 'movie', 'tv', or 'all'
 * @param {string} timeWindow - 'day' or 'week'
 * @returns {Promise<Object>} The trending results
 */
export const fetchTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching trending:', error)
    return { results: [] }
  }
}

/**
 * Fetch movie details by ID
 * @param {number} id - Movie ID
 * @returns {Promise<Object>} Movie details
 */
export const fetchMovieDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar,videos`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

/**
 * Fetch TV show details by ID
 * @param {number} id - TV show ID
 * @returns {Promise<Object>} TV show details
 */
export const fetchShowDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,similar,videos`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching show details:', error)
    return null
  }
}

/**
 * Fetch movies with filters
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @param {number} resultsPerPage - Number of results per page (max 50)
 * @returns {Promise<Object>} Filtered movie results with pagination info
 */
export const fetchMovies = async (
  filters = {},
  page = 1,
  resultsPerPage = 50
) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      page: page,
      ...filters,
    }).toString()

    const response = await fetch(`${BASE_URL}/discover/movie?${queryParams}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching movies:', error)
    return { results: [], total_pages: 0, total_results: 0, page: page }
  }
}

/**
 * Fetch TV shows with filters
 * @param {Object} filters - Filter parameters
 * @param {number} page - Page number
 * @param {number} resultsPerPage - Number of results per page (max 50)
 * @returns {Promise<Object>} Filtered TV show results with pagination info
 */
export const fetchShows = async (
  filters = {},
  page = 1,
  resultsPerPage = 50
) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      page: page,
      ...filters,
    }).toString()

    const response = await fetch(`${BASE_URL}/discover/tv?${queryParams}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching shows:', error)
    return { results: [], total_pages: 0, total_results: 0, page: page }
  }
}

/**
 * Fetch movie and TV genres
 * @param {string} type - 'movie' or 'tv'
 * @returns {Promise<Array>} Genres list
 */
export const fetchGenres = async (type = 'movie') => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`
    )
    const data = await response.json()
    return data.genres || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return []
  }
}

/**
 * Search for movies, TV shows, or both
 * @param {string} query - Search term
 * @param {string} type - 'movie', 'tv', or 'multi'
 * @param {number} page - Page number
 * @returns {Promise<Object>} Search results
 */
export const searchMedia = async (query, type = 'multi', page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error searching media:', error)
    return { results: [] }
  }
}

/**
 * Search TMDB API for movies, TV shows, and people
 * @param {string} query - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} Formatted search results with pagination info
 */
export const searchTMDB = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching TMDB:', error)
    return { results: [], total_pages: 0, total_results: 0, page: page }
  }
}

/**
 * Search for content by genre ID
 * @param {number} genreId - The genre ID to search for
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {number} page - Page number
 * @returns {Promise<Object>} Content with the specified genre, with pagination info
 */
export const searchByGenre = async (genreId, mediaType = 'movie', page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error searching ${mediaType} by genre:`, error)
    return { results: [], total_pages: 0, total_results: 0, page: page }
  }
}

/**
 * Fetch person details by ID
 * @param {number} id - Person ID
 * @returns {Promise<Object>} Person details
 */
export const fetchPersonDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching person details:', error)
    return null
  }
}

/**
 * Helper function to preload images
 * @param {string} src - The image URL to preload
 * @returns {Promise} - Promise that resolves when the image is loaded or rejects on error
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'))
      return
    }

    const img = new Image()
    img.onload = () => resolve(src)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

/**
 * Preload multiple images
 * @param {Array<string>} sources - Array of image URLs to preload
 * @returns {Promise} - Promise that resolves when all images are loaded, with an array of results
 */
export const preloadImages = (sources = []) => {
  if (!sources.length) return Promise.resolve([])

  // Create an array of promises from the sources
  const promises = sources
    .filter((src) => src) // Filter out null/undefined sources
    .map((src) => preloadImage(src).catch(() => null)) // Handle individual failures

  // Return a promise that resolves when all promises are settled
  return Promise.allSettled(promises)
}

/**
 * Helper function to generate proper TMDB image URLs
 * @param {string} path - The image path from TMDB
 * @param {string} size - The size of the image (w500, original, etc.)
 * @returns {string|null} - Full image URL or null if path is invalid
 */
export const getTMDBImageUrl = (path, size = 'w500') => {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}
