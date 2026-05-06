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
    try {
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

        // Check if response is not ok (including 500 errors)
        if (!response.ok) {
            const errorMessage = `HTTP ${response.status}: ${response.statusText}`
            console.error('Chat API Error:', errorMessage)
            throw new Error(errorMessage)
        }

        const responseData = await response.json()
        return responseData
    } catch (error) {
        // Log any network or parsing errors
        console.error('Chat API Error:', error.message)
        throw error
    }
}
