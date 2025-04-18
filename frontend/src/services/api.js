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
 * @returns {Promise<Object>} Filtered movie results
 */
export const fetchMovies = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...filters,
    }).toString()

    const response = await fetch(`${BASE_URL}/discover/movie?${queryParams}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching movies:', error)
    return { results: [] }
  }
}

/**
 * Fetch TV shows with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Filtered TV show results
 */
export const fetchShows = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...filters,
    }).toString()

    const response = await fetch(`${BASE_URL}/discover/tv?${queryParams}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching shows:', error)
    return { results: [] }
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
 * @returns {Promise<Array>} Formatted search results
 */
export const searchTMDB = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`
    )
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching TMDB:', error)
    return []
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
