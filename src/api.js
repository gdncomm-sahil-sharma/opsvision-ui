/**
 * Simple API Helper
 */

const API_BASE_URL = import.meta.env.VITE_BE_API_BASE_URL || 'http://localhost:3000/api'
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
