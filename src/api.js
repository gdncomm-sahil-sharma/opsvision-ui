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
 * Streaming Chat API function
 * @param {string} userId - User ID
 * @param {string|null} chatId - Chat ID (null for new chat)
 * @param {string} message - Message entered in chat box
 * @param {object} handlers - Event handlers for different stream events
 * @returns {Promise<void>}
 */
export async function streamChat (userId, chatId, message, handlers) {
    try {
        const response = await fetch(`${API_BASE_URL}/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({
                userId,
                chatId,
                message
            })
        })

        // Check if response is not ok (including 500 errors)
        if (!response.ok) {
            const errorMessage = `HTTP ${response.status}: ${response.statusText}`
            console.error('Streaming Chat API Error:', errorMessage)
            throw new Error(errorMessage)
        }

        const reader = response.body.getReader()
        // eslint-disable-next-line no-undef
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const blocks = buffer.split('\n\n')
            buffer = blocks.pop() // Keep incomplete block in buffer

            for (const block of blocks) {
                if (!block.trim()) continue

                const eventType = /^event:\s*(.+)$/m.exec(block)?.[1]?.trim()
                const eventData = /^data:\s*(.+)$/m.exec(block)?.[1]

                if (!eventType || !eventData) continue

                try {
                    const parsedData = JSON.parse(eventData)
                    if (handlers[eventType]) {
                        handlers[eventType](parsedData)
                    }
                } catch (parseError) {
                    console.error('Error parsing event data:', parseError)
                }
            }
        }
    } catch (error) {
        console.error('Streaming Chat API Error:', error.message)
        if (handlers.error) {
            handlers.error({ errorMessage: error.message })
        }
        throw error
    }
}

/**
 * Legacy Chat API function (kept for backward compatibility)
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
