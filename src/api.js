/**
 * Simple API Helper
 */

// Use proxy path for development, or full URL for production
const API_BASE_URL = '/opsvision/api'
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
 * Chat API function
 * @param {string} message - Message entered in chat box
 * @returns {Promise<object>}
 */
export async function chatApi (message) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: 'demo-user',
            message: message
        })
    })
    const responseData = await response.json()
    return responseData
}
