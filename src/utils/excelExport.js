/**
 * Excel Export Utilities for OpsVision
 * Handles table data export to Excel format (.xlsx)
 */

/**
 * Format cell value for display - replace null, empty, or "null" string with dash
 * @param {any} value - The cell value to format
 * @returns {string} - Formatted cell value
 */
const formatCellValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 'null') {
        return '-'
    }
    return String(value)
}

/**
 * Sanitize and truncate sheet name to Excel's 31 character limit
 * @param {string} name - The desired sheet name
 * @returns {string} - Valid Excel sheet name
 */
const sanitizeSheetName = (name) => {
    if (!name || typeof name !== 'string') {
        return 'Sheet1'
    }
    
    // Remove invalid characters for Excel sheet names
    let sanitized = name.replace(/[\\\/\[\]\*\?:]/g, ' ')
    
    // Trim whitespace
    sanitized = sanitized.trim()
    
    // If still too long, truncate to 31 chars
    if (sanitized.length > 31) {
        sanitized = sanitized.substring(0, 28) + '...'
    }
    
    // If empty after sanitization, provide default
    if (!sanitized) {
        return 'Sheet1'
    }
    
    return sanitized
}

/**
 * Generate Excel file from table data
 * @param {Object} tableData - The table data
 * @param {string} tableData.title - Table title
 * @param {Array<string>} tableData.headers - Column headers
 * @param {Array<Array>} tableData.data - Table rows data
 * @param {string} query - The user's original query (optional)
 * @returns {Promise<void>}
 */
export const generateTableExcel = async (tableData, query = null) => {
    try {
        // Dynamic import for xlsx library
        const XLSX = await import('xlsx')
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new()
        
        // Prepare data for Excel
        const excelData = []
        
        // Add metadata rows if query exists
        if (query) {
            excelData.push(['OpsVision Data Export'])
            excelData.push(['Generated on:', new Date().toLocaleString()])
            excelData.push(['Your Query:', query])
            excelData.push([]) // Empty row for spacing
        }
        
        // Add table title
        if (tableData.title) {
            excelData.push([tableData.title])
            excelData.push([]) // Empty row for spacing
        }
        
        // Add headers
        excelData.push(tableData.headers)
        
        // Add data rows
        tableData.data.forEach(row => {
            const formattedRow = row.map(cell => formatCellValue(cell))
            excelData.push(formattedRow)
        })
        
        // Create worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(excelData)
        
        // Auto-size columns based on content
        const columnWidths = []
        
        // Calculate max width for each column
        tableData.headers.forEach((header, colIndex) => {
            let maxWidth = String(header || '').length
            
            // Check data rows for maximum width
            tableData.data.forEach(row => {
                const cellValue = formatCellValue(row[colIndex])
                maxWidth = Math.max(maxWidth, cellValue.length)
            })
            
            // Set reasonable min/max limits
            columnWidths.push({
                wch: Math.min(Math.max(maxWidth + 2, 10), 50)
            })
        })
        
        worksheet['!cols'] = columnWidths
        
        // Style the header row (if we have data)
        const headerRowIndex = query ? (tableData.title ? 6 : 4) : (tableData.title ? 2 : 0)
        
        // Add some basic styling
        if (worksheet['!rows']) {
            worksheet['!rows'] = []
        } else {
            worksheet['!rows'] = []
        }
        
        // Make header row bold (basic styling)
        tableData.headers.forEach((_, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: colIndex })
            if (worksheet[cellRef]) {
                worksheet[cellRef].s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: 'F0F0F0' } }
                }
            }
        })
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
        
        // Generate filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        const filename = `opsvision-table-${timestamp}.xlsx`
        
        // Write and download file
        XLSX.writeFile(workbook, filename)
        
    } catch (error) {
        console.error('Failed to generate Excel file:', error)
        
        // Fallback: Generate CSV if Excel fails
        await generateTableCSV(tableData, query)
    }
}

/**
 * Fallback CSV generation if Excel library fails
 * @param {Object} tableData - The table data
 * @param {string} query - The user's original query (optional)
 */
const generateTableCSV = (tableData, query = null) => {
    let csvContent = ''
    
    // Add metadata
    if (query) {
        csvContent += 'OpsVision Data Export\n'
        csvContent += `Generated on,${new Date().toLocaleString()}\n`
        csvContent += `Your Query,"${query}"\n\n`
    }
    
    // Add table title
    if (tableData.title) {
        csvContent += `${tableData.title}\n\n`
    }
    
    // Add headers
    csvContent += tableData.headers.map(header => `"${String(header || '').replace(/"/g, '""')}"`).join(',') + '\n'
    
    // Add data rows
    tableData.data.forEach(row => {
        const csvRow = row.map(cell => {
            const cellValue = formatCellValue(cell)
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
                return `"${cellValue.replace(/"/g, '""')}"`
            }
            return cellValue
        }).join(',')
        csvContent += csvRow + '\n'
    })
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `opsvision-table-${timestamp}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
}

/**
 * Generate Excel file with multiple sheets (for comprehensive response)
 * @param {Object} message - The complete message object
 * @returns {Promise<void>}
 */
export const generateComprehensiveExcel = async (message) => {
    try {
        const XLSX = await import('xlsx')
        const workbook = XLSX.utils.book_new()
        
        // Sheet 1: Summary (if there's text response)
        const textData = message.streamingComponents?.textResponse || message.results?.data?.textResponse
        if (textData) {
            const summaryData = []
            summaryData.push(['OpsVision AI Response'])
            summaryData.push(['Generated on:', new Date(message.timestamp).toLocaleString()])
            if (message.query) {
                summaryData.push(['Your Query:', message.query])
            }
            summaryData.push([])
            
            if (textData.summary) {
                summaryData.push(['Summary:'])
                summaryData.push([textData.summary])
                summaryData.push([])
            }
            
            if (textData.bullets && textData.bullets.length > 0) {
                summaryData.push(['Key Points:'])
                textData.bullets.forEach(bullet => {
                    summaryData.push([`• ${bullet}`])
                })
            }
            
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
            summarySheet['!cols'] = [{ wch: 80 }] // Wide column for text
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'AI Response')
        }
        
        // Sheet 2: Timeline Data (if exists)
        const timelineData = message.streamingComponents?.timeline || message.results?.data?.timelines
        if (timelineData && timelineData.data && timelineData.data.length > 0) {
            const timelineExcelData = []
            
            // Convert timeline data to table format
            if (timelineData.data.length > 0) {
                // Use fixed headers for timeline: Date, Title, Description, Status
                const headerLabels = ['Date', 'Title', 'Description', 'Status']
                
                // Add headers
                timelineExcelData.push(headerLabels)
                
                // Convert timeline data to table rows with fixed column mapping
                timelineData.data.forEach(item => {
                    // Handle date formatting
                    let formattedDate = formatCellValue(item.date)
                    if (item.date) {
                        try {
                            const numValue = Number(item.date)
                            
                            // Check if it's a Unix timestamp in milliseconds
                            if (!isNaN(numValue) && numValue > 1000000000000) {
                                const date = new Date(numValue)
                                formattedDate = date.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })
                            }
                            // Check if it's a YYYYMMDD format
                            else if (String(item.date).length === 8 && /^\d{8}$/.test(String(item.date))) {
                                const dateStr = String(item.date)
                                const year = dateStr.substring(0, 4)
                                const month = dateStr.substring(4, 6)
                                const day = dateStr.substring(6, 8)
                                const date = new Date(year, month - 1, day)
                                formattedDate = date.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })
                            }
                            // Fallback - try to parse as is
                            else {
                                const date = new Date(item.date)
                                if (!isNaN(date.getTime())) {
                                    formattedDate = date.toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })
                                }
                            }
                        } catch (e) {
                            formattedDate = formatCellValue(item.date)
                        }
                    }
                    
                    const row = [
                        formattedDate,
                        formatCellValue(item.title),
                        formatCellValue(item.description || item.desc || item.details),
                        formatCellValue(item.status)
                    ]
                    timelineExcelData.push(row)
                })
            }
            
            const timelineSheet = XLSX.utils.aoa_to_sheet(timelineExcelData)
            
            // Auto-size columns for timeline
            const timelineColumnWidths = timelineExcelData[0].map((header, colIndex) => {
                let maxWidth = String(header || '').length
                timelineExcelData.slice(1).forEach(row => {
                    const cellValue = formatCellValue(row[colIndex])
                    maxWidth = Math.max(maxWidth, cellValue.length)
                })
                return { wch: Math.min(Math.max(maxWidth + 2, 10), 50) }
            })
            
            timelineSheet['!cols'] = timelineColumnWidths
            
            // Style the timeline header row
            if (timelineExcelData.length > 0) {
                timelineExcelData[0].forEach((_, colIndex) => {
                    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex })
                    if (timelineSheet[cellRef]) {
                        timelineSheet[cellRef].s = {
                            font: { bold: true },
                            fill: { fgColor: { rgb: 'E8F4FD' } } // Light blue background for timeline
                        }
                    }
                })
            }
            
            XLSX.utils.book_append_sheet(workbook, timelineSheet, sanitizeSheetName(timelineData.title || 'Timeline Data'))
        }
        
        // Sheet 3: Table Data (if exists)
        const tableData = message.streamingComponents?.table || message.results?.data?.table
        if (tableData && tableData.data && tableData.data.length > 0) {
            const tableExcelData = []
            
            // Add headers
            tableExcelData.push(tableData.headers)
            
            // Add all data rows
            tableData.data.forEach(row => {
                const formattedRow = row.map(cell => formatCellValue(cell))
                tableExcelData.push(formattedRow)
            })
            
            const tableSheet = XLSX.utils.aoa_to_sheet(tableExcelData)
            
            // Auto-size columns
            const columnWidths = tableData.headers.map((header, colIndex) => {
                let maxWidth = String(header || '').length
                tableData.data.forEach(row => {
                    const cellValue = formatCellValue(row[colIndex])
                    maxWidth = Math.max(maxWidth, cellValue.length)
                })
                return { wch: Math.min(Math.max(maxWidth + 2, 10), 50) }
            })
            
            tableSheet['!cols'] = columnWidths
            XLSX.utils.book_append_sheet(workbook, tableSheet, sanitizeSheetName(tableData.title || 'Table Data'))
        }
        
        // Generate filename
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        const filename = `opsvision-complete-response-${timestamp}.xlsx`
        
        // Write and download file
        XLSX.writeFile(workbook, filename)
        
    } catch (error) {
        console.error('Failed to generate comprehensive Excel file:', error)
        throw error
    }
}