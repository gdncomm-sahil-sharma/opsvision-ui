/**
 * Response Helper - Choose between different response types
 */

/**
 * Determine the response type based on available data
 * @param {object} responseData - API response data
 * @returns {array} - Array of response types: ['table'], ['timelines'], ['text'] or multiple types
 */
export function getResponseType (responseData) {
    if (!responseData || !responseData.data) {
        return ['text']
    }

    const { data } = responseData
    const types = []

    if (data.table && data.table.data && data.table.data.length > 0) {
        types.push('table')
    }

    if (data.timelines && data.timelines.data && data.timelines.data.length > 0) {
        types.push('timelines')
    }

    if (data.textResponse) {
        types.push('text')
    }

    if (types.length === 0) {
        return ['text']
    }

    return types
}

/**
 * Get table data from response
 * @param {object} responseData - API response data
 * @returns {object|null} - Table data or null
 */
export function getTableData (responseData) {
    return responseData?.data?.table || null
}

/**
 * Get timelines data from response
 * @param {object} responseData - API response data
 * @returns {object|null} - Timelines data or null
 */
export function getTimelinesData (responseData) {
    return responseData?.data?.timelines || null
}

/**
 * Get text response data
 * @param {object} responseData - API response data
 * @returns {object|null} - Text response data or null
 */
export function getTextData (responseData) {
    return responseData?.data?.textResponse || null
}

/**
 * Parse and structure response data based on type
 * @param {object} responseData - API response data
 * @returns {object} - Structured response with type and data
 */
export function parseResponse (responseData) {
    const type = getResponseType(responseData)

    const result = {
        type,
        timestamp: responseData?.timestamp || Date.now(),
        status: responseData?.status || 200
    }

    switch (type) {
    case 'table':
        result.data = getTableData(responseData)
        break
    case 'timelines':
        result.data = getTimelinesData(responseData)
        break
    case 'text':
    default:
        result.data = getTextData(responseData)
        break
    }

    return result
}
