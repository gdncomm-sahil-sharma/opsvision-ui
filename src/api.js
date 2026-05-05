/**
 * Simple API Helper
 */

const API_BASE_URL = 'http://localhost:3000/api'
/**
 * Generic GET fetch function
 * @param {string} endpoint - API endpoint
 * @returns {Promise<object>}
 */
export async function getFetch (endpoint) {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`)
    const responseData = await response.json()
    return responseData
}

/**
 * Search API function
 * @param {string} query - Search query
 * @returns {Promise<object>}
 */
export async function searchApi (query) {
    return await getFetch(`opsvision/search?query=${encodeURIComponent(query)}`)
}
