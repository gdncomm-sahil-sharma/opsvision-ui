import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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
 * Calculate text metrics based on word count for better PDF layout
 * @param {string} text - The text to analyze
 * @returns {Object} - Text metrics including word count, character count, and average word length
 */
const calculateTextMetrics = (text) => {
    const cleanText = String(text || '').trim()
    if (!cleanText) return { wordCount: 0, charCount: 0, avgWordLength: 0 }
    
    const words = cleanText.split(/\s+/)
    const wordCount = words.length
    const charCount = cleanText.length
    const avgWordLength = charCount / Math.max(1, wordCount)
    
    // Calculate complexity score based on word patterns
    const hasLongWords = words.some(word => word.length > 12)
    const hasSpecialChars = /[^\w\s]/.test(cleanText)
    const complexityMultiplier = (hasLongWords ? 1.2 : 1) * (hasSpecialChars ? 1.1 : 1)
    
    return {
        wordCount,
        charCount,
        avgWordLength: avgWordLength * complexityMultiplier,
        hasLongWords,
        hasSpecialChars
    }
}

/**
 * Estimate lines needed based on word count and column width
 * @param {string} text - The text to estimate
 * @param {number} columnWidth - Available column width
 * @param {number} fontSize - Font size being used
 * @returns {number} - Estimated number of lines needed
 */
const estimateLineCount = (text, columnWidth, fontSize = 9) => {
    const metrics = calculateTextMetrics(text)
    if (metrics.wordCount === 0) return 1
    
    // Rough calculation: fontSize * 0.6 gives approximate character width in pixels
    const charWidth = fontSize * 0.6
    const availableChars = Math.floor(columnWidth / charWidth)
    const wordsPerLine = Math.max(1, Math.floor(availableChars / (metrics.avgWordLength + 1))) // +1 for space
    
    return Math.ceil(metrics.wordCount / wordsPerLine)
}

/**
 * Generate PDF from text content (AI Response)
 * @param {Object} data - The text response data
 * @param {string} data.summary - Main text content
 * @param {Array<string>} data.bullets - Array of bullet points
 * @param {string} query - The user's original query (optional)
 * @returns {Promise<void>}
 */
export const generateTextResponsePDF = async (data, query = null) => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 30

    // Add header
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OpsVision AI Response', margin, yPosition)
    
    // Add timestamp
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const timestamp = new Date().toLocaleString()
    pdf.text(`Generated on: ${timestamp}`, margin, yPosition + 10)
    
    yPosition += 30

    // Add user query if provided
    if (query) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Your Query:', margin, yPosition)
        yPosition += 10

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'italic')
        pdf.setTextColor(60, 60, 60) // Darker gray for query
        
        const splitQuery = pdf.splitTextToSize(`"${query}"`, maxWidth)
        
        // Check if we need a new page
        if (yPosition + (splitQuery.length * 6) > pageHeight - margin) {
            pdf.addPage()
            yPosition = 30
        }
        
        pdf.text(splitQuery, margin, yPosition)
        yPosition += (splitQuery.length * 6) + 20
        
        // Reset text color
        pdf.setTextColor(0, 0, 0)
        
        // Add separator line
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10)
        yPosition += 5
    }

    // Add main summary
    if (data.summary) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        
        const splitSummary = pdf.splitTextToSize(data.summary, maxWidth)
        
        // Check if we need a new page
        if (yPosition + (splitSummary.length * 7) > pageHeight - margin) {
            pdf.addPage()
            yPosition = 30
        }
        
        pdf.text(splitSummary, margin, yPosition)
        yPosition += (splitSummary.length * 7) + 15
    }

    // Add bullet points
    if (data.bullets && data.bullets.length > 0) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        
        // Check if we need a new page for the heading
        if (yPosition + 10 > pageHeight - margin) {
            pdf.addPage()
            yPosition = 30
        }
        
        pdf.text('Key Points:', margin, yPosition)
        yPosition += 15

        pdf.setFontSize(11)
        pdf.setFont('helvetica', 'normal')
        
        data.bullets.forEach((bullet, index) => {
            const bulletText = `• ${bullet}`
            const splitBullet = pdf.splitTextToSize(bulletText, maxWidth)
            
            // Check if we need a new page
            if (yPosition + (splitBullet.length * 6) > pageHeight - margin) {
                pdf.addPage()
                yPosition = 30
            }
            
            pdf.text(splitBullet, margin, yPosition)
            yPosition += (splitBullet.length * 6) + 5
        })
    }

    // Save the PDF
    const filename = `opsvision-response-${Date.now()}.pdf`
    pdf.save(filename)
}

/**
 * Generate PDF from table data
 * @param {Object} tableData - The table data
 * @param {string} tableData.title - Table title
 * @param {Array<string>} tableData.headers - Column headers
 * @param {Array<Array>} tableData.data - Table rows data
 * @param {boolean} showAllData - Whether to show all data (no pagination)
 * @param {string} query - The user's original query (optional)
 * @returns {Promise<void>}
 */
export const generateTablePDF = async (tableData, showAllData = true, query = null) => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 25

    // Add header
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OpsVision Data Export', margin, yPosition)
    
    // Add timestamp
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const timestamp = new Date().toLocaleString()
    pdf.text(`Generated on: ${timestamp}`, margin, yPosition + 10)
    
    yPosition += 25

    // Add user query if provided
    if (query) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Your Query:', margin, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'italic')
        pdf.setTextColor(60, 60, 60) // Darker gray for query
        
        const splitQuery = pdf.splitTextToSize(`"${query}"`, maxWidth)
        
        // Check if we need a new page
        if (yPosition + (splitQuery.length * 5) > pageHeight - margin) {
            pdf.addPage()
            yPosition = 25
        }
        
        pdf.text(splitQuery, margin, yPosition)
        yPosition += (splitQuery.length * 5) + 15
        
        // Reset text color
        pdf.setTextColor(0, 0, 0)
        
        // Add separator line
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPosition - 8, pageWidth - margin, yPosition - 8)
        yPosition += 5
    }

    // Add table title with proper spacing
    if (tableData.title) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        
        if (yPosition + 25 > pageHeight - margin) {
            pdf.addPage()
            yPosition = 25
        }
        
        pdf.text(tableData.title, margin, yPosition)
        yPosition += 15 // Space after title
        
        // Add a subtle separator line
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(0.5)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 10 // Space after separator
    }

    // Calculate dynamic column widths based on content
    const numColumns = tableData.headers.length
    const minColumnWidth = 45 // Further increased minimum width for header visibility
    const maxColumnWidth = maxWidth / Math.max(2, numColumns * 0.75) // Even more generous max width
    
    // Calculate optimal column widths based on word count and content complexity
    const columnWidths = tableData.headers.map((header, index) => {
        const headerMetrics = calculateTextMetrics(header)
        
        // Get metrics for all content in this column
        const contentMetrics = tableData.data.map(row => calculateTextMetrics(row[index]))
        
        // Find the most demanding content requirements
        const maxWordCount = Math.max(0, headerMetrics.wordCount, ...contentMetrics.map(m => m.wordCount))
        const maxAvgWordLength = Math.max(0, headerMetrics.avgWordLength, ...contentMetrics.map(m => m.avgWordLength))
        const hasComplexContent = contentMetrics.some(m => m.hasLongWords || m.hasSpecialChars)
        
        // Calculate width requirements with extra emphasis on headers
        const wordBasedWidth = maxWordCount * maxAvgWordLength * 5.5 // Increased multiplier
        const complexityBonus = hasComplexContent ? 20 : 0 // More bonus for complex content
        const headerBonus = headerMetrics.wordCount > 2 ? 10 : 0 // Extra space for long headers
        const calculatedWidth = wordBasedWidth + complexityBonus + headerBonus
        
        return Math.min(Math.max(minColumnWidth, calculatedWidth), maxColumnWidth)
    })
    
    // Adjust widths to fit page if total exceeds maxWidth
    const totalCalculatedWidth = columnWidths.reduce((sum, width) => sum + width, 0)
    const finalColumnWidths = totalCalculatedWidth > maxWidth 
        ? columnWidths.map(width => (width / totalCalculatedWidth) * maxWidth)
        : columnWidths
    
    const rowHeight = 18 // Further increased for better readability
    const headerHeight = 24 // Increased header height for more spacing

    // Function to draw table header with proper text wrapping and spacing
    const drawHeader = (startY) => {
        // Calculate required header height based on word count and column width
        const headerLineHeights = tableData.headers.map((header, index) => {
            const colWidth = finalColumnWidths[index]
            const headerText = String(header || '')
            if (!headerText.trim()) return 1
            
            // Use both actual text splitting and word-based estimation
            const splitHeader = pdf.splitTextToSize(headerText, colWidth - 12)
            const estimatedHeaderLines = estimateLineCount(headerText, colWidth - 12, 10) // Header font size 10
            
            // Use the more conservative estimate for headers (they need to be fully visible)
            return Math.max(splitHeader.length, estimatedHeaderLines)
        })
        
        const maxHeaderLines = Math.max(1, ...headerLineHeights)
        // Enhanced height calculation: more space per line + generous padding
        const dynamicHeaderHeight = Math.max(headerHeight, maxHeaderLines * 9 + 18) // Even more generous spacing
        
        // Add space before header
        const headerStartY = startY + 8 // Add space above header
        
        // Draw header background
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin, headerStartY, maxWidth, dynamicHeaderHeight, 'F')
        
        // Draw header borders
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.5)
        let currentX = margin
        finalColumnWidths.forEach((colWidth) => {
            pdf.rect(currentX, headerStartY, colWidth, dynamicHeaderHeight)
            currentX += colWidth
        })
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        
        let xPosition = margin
        tableData.headers.forEach((header, index) => {
            const colWidth = finalColumnWidths[index]
            const headerText = String(header || 'Column ' + (index + 1)) // Fallback for empty headers
            
            // Split text to fit column width with generous padding for headers
            const splitHeader = pdf.splitTextToSize(headerText, colWidth - 12)
            
            // Start from top of the header cell with generous padding
            const startTextY = headerStartY + 10 // More top padding
            
            // Draw each line of wrapped text with generous line spacing
            splitHeader.forEach((line, lineIndex) => {
                const textY = startTextY + (lineIndex * 8) // More line spacing for headers
                // Ensure text doesn't exceed cell boundaries with margin
                if (textY <= headerStartY + dynamicHeaderHeight - 6) {
                    pdf.text(line, xPosition + 6, textY) // More left padding
                }
            })
            
            xPosition += colWidth
        })
        
        // Return position for next content with space after header
        return headerStartY + dynamicHeaderHeight + 6 // Add space after header
    }

    // Draw header with adequate space check
    const requiredHeaderSpace = headerHeight + 20 // Extra space for header
    if (yPosition + requiredHeaderSpace > pageHeight - margin) {
        pdf.addPage()
        yPosition = 25
    }
    yPosition = drawHeader(yPosition)

    // Add table rows with proper text wrapping
    const dataToExport = showAllData ? tableData.data : tableData.data.slice(0, 200) // Show more data by default
    
    dataToExport.forEach((row, rowIndex) => {
        // Calculate required height for this row based on word count and wrapping
        const rowContentHeights = row.map((cell, cellIndex) => {
            const colWidth = finalColumnWidths[cellIndex]
            const cellText = formatCellValue(cell)
            
            // Use both actual jsPDF splitting and our word-based estimation
            const splitText = pdf.splitTextToSize(cellText, colWidth - 6)
            const estimatedLines = estimateLineCount(cellText, colWidth - 6, 10) // Font size 10
            
            // Use the more conservative estimate (higher line count) for better layout
            const finalLineCount = Math.max(splitText.length, estimatedLines, 1)
            return finalLineCount * 6 // 6 units per line for better spacing
        })
        const requiredRowHeight = Math.max(rowHeight, Math.max(...rowContentHeights))
        
        // Check if we need a new page (accounting for header space)
        const requiredSpaceWithHeader = requiredRowHeight + headerHeight + 20
        if (yPosition + requiredSpaceWithHeader > pageHeight - margin) {
            pdf.addPage()
            yPosition = 25
            yPosition = drawHeader(yPosition) // Redraw header on new page
        }

        // Alternate row background
        if (rowIndex % 2 === 0) {
            pdf.setFillColor(250, 250, 250)
            pdf.rect(margin, yPosition - requiredRowHeight + 2, maxWidth, requiredRowHeight, 'F')
        }

        // Draw cell borders
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(0.3)
        let currentX = margin
        finalColumnWidths.forEach((colWidth) => {
            pdf.rect(currentX, yPosition - requiredRowHeight + 2, colWidth, requiredRowHeight)
            currentX += colWidth
        })

        pdf.setFontSize(10) // Increased content font size
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(0, 0, 0)

        let xPosition = margin
        row.forEach((cell, cellIndex) => {
            const colWidth = finalColumnWidths[cellIndex]
            const cellText = formatCellValue(cell)
            
            // Split text to fit column width with optimized padding
            const splitText = pdf.splitTextToSize(cellText, colWidth - 6)
            
            // Draw each line of wrapped text with better spacing
            const maxLinesPerCell = Math.min(4, Math.floor(requiredRowHeight / 6)) // More adaptive line limit
            splitText.forEach((line, lineIndex) => {
                if (lineIndex < maxLinesPerCell) {
                    const textY = yPosition - requiredRowHeight + 8 + (lineIndex * 6)
                    pdf.text(line, xPosition + 3, textY) // Less left padding
                }
            })
            
            // Add ellipsis if text was truncated
            if (splitText.length > maxLinesPerCell) {
                const ellipsisY = yPosition - requiredRowHeight + 8 + ((maxLinesPerCell - 1) * 6)
                pdf.text('...', xPosition + 3, ellipsisY) // Match text padding
            }
            
            xPosition += colWidth
        })

        yPosition += requiredRowHeight
    })

    // Add footer with row count
    const totalRows = tableData.data.length
    const exportedRows = dataToExport.length
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100, 100, 100)
    
    const footerText = showAllData 
        ? `Total records: ${totalRows}`
        : `Showing ${exportedRows} of ${totalRows} records`
    
    pdf.text(footerText, margin, pageHeight - 10)

    // Save the PDF
    const filename = `opsvision-table-${Date.now()}.pdf`
    pdf.save(filename)
}

/**
 * Generate PDF from HTML element (for complex layouts)
 * @param {HTMLElement} element - The DOM element to export
 * @param {string} filename - The filename for the PDF
 * @returns {Promise<void>}
 */
export const generateHTMLToPDF = async (element, filename = 'opsvision-export') => {
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            allowTaint: true
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 295 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        pdf.save(`${filename}-${Date.now()}.pdf`)
    } catch (error) {
        console.error('Error generating PDF:', error)
        throw new Error('Failed to generate PDF from HTML')
    }
}

/**
 * Generate comprehensive PDF with both text and table data
 * @param {Object} message - The complete message object
 * @returns {Promise<void>}
 */
export const generateComprehensivePDF = async (message) => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const maxWidth = pageWidth - 2 * margin
    let yPosition = 30

    // Add header
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OpsVision Complete Response', margin, yPosition)
    
    // Add timestamp
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    const timestamp = new Date(message.timestamp).toLocaleString()
    pdf.text(`Generated on: ${timestamp}`, margin, yPosition + 10)
    
    yPosition += 35

    // Add user query if available
    if (message.query) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Your Query:', margin, yPosition)
        yPosition += 12

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'italic')
        pdf.setTextColor(60, 60, 60) // Darker gray for query
        
        const splitQuery = pdf.splitTextToSize(`"${message.query}"`, maxWidth)
        
        // Check if we need a new page
        if (yPosition + (splitQuery.length * 7) > pageHeight - margin) {
            pdf.addPage()
            yPosition = 30
        }
        
        pdf.text(splitQuery, margin, yPosition)
        yPosition += (splitQuery.length * 7) + 20
        
        // Reset text color
        pdf.setTextColor(0, 0, 0)
        
        // Add separator line
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, yPosition - 10, pageWidth - margin, yPosition - 10)
        yPosition += 10
    }

    // Check if there's text response data
    const textData = message.streamingComponents?.textResponse || message.results?.data?.textResponse
    if (textData) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('AI Response', margin, yPosition)
        yPosition += 15

        // Add summary
        if (textData.summary) {
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'normal')
            const splitSummary = pdf.splitTextToSize(textData.summary, maxWidth)
            
            if (yPosition + (splitSummary.length * 6) > pageHeight - margin) {
                pdf.addPage()
                yPosition = 30
            }
            
            pdf.text(splitSummary, margin, yPosition)
            yPosition += (splitSummary.length * 6) + 15
        }

        // Add bullets
        if (textData.bullets && textData.bullets.length > 0) {
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Key Points:', margin, yPosition)
            yPosition += 10

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            
            textData.bullets.forEach(bullet => {
                const bulletText = `• ${bullet}`
                const splitBullet = pdf.splitTextToSize(bulletText, maxWidth)
                
                if (yPosition + (splitBullet.length * 5) > pageHeight - margin) {
                    pdf.addPage()
                    yPosition = 30
                }
                
                pdf.text(splitBullet, margin, yPosition)
                yPosition += (splitBullet.length * 5) + 3
            })
        }
    }

    // Timeline data is excluded from PDF export (only available in Excel export)

    // Check if there's table data
    const tableData = message.streamingComponents?.table || message.results?.data?.table
    if (tableData && tableData.data && tableData.data.length > 0) {
        // Start table on new page for better separation
        pdf.addPage()
        yPosition = 25

        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text(tableData.title || 'Data Table', margin, yPosition)
        yPosition += 12
        
        // Add a subtle separator line
        pdf.setDrawColor(220, 220, 220)
        pdf.setLineWidth(0.5)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 8 // Space after separator

        // Improved table rendering with text wrapping
        const maxRows = Math.min(25, tableData.data.length) // Show even more rows in comprehensive view
        
        // Calculate dynamic column widths (same improved logic as main function)
        const numColumns = tableData.headers.length
        const minColumnWidth = 40 // Increased for header visibility in comprehensive view
        const maxColumnWidth = maxWidth / Math.max(2, numColumns * 0.65) // More space per column
        
        const columnWidths = tableData.headers.map((header, index) => {
            const headerMetrics = calculateTextMetrics(header)
            
            // Get metrics for content in this column (limited to maxRows for comprehensive view)
            const contentMetrics = tableData.data.slice(0, maxRows).map(row => calculateTextMetrics(row[index]))
            
            // Find the most demanding content requirements
            const maxWordCount = Math.max(0, headerMetrics.wordCount, ...contentMetrics.map(m => m.wordCount))
            const maxAvgWordLength = Math.max(0, headerMetrics.avgWordLength, ...contentMetrics.map(m => m.avgWordLength))
            const hasComplexContent = [headerMetrics, ...contentMetrics].some(m => m.hasLongWords || m.hasSpecialChars)
            
            // Calculate width requirements with header consideration for comprehensive view
            const wordBasedWidth = maxWordCount * maxAvgWordLength * 4.2 // Less compact to show headers fully
            const complexityBonus = hasComplexContent ? 12 : 0
            const headerBonus = headerMetrics.wordCount > 2 ? 8 : 0 // Header bonus for comprehensive view
            const calculatedWidth = wordBasedWidth + complexityBonus + headerBonus
            
            return Math.min(Math.max(minColumnWidth, calculatedWidth), maxColumnWidth)
        })
        
        const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0)
        const finalCompColumnWidths = totalWidth > maxWidth 
            ? columnWidths.map(width => (width / totalWidth) * maxWidth)
            : columnWidths
        
        // Calculate dynamic header height using word-based estimation
        const headerLineHeights = tableData.headers.map((header, index) => {
            const colWidth = finalCompColumnWidths[index]
            const headerText = String(header || '')
            if (!headerText.trim()) return 1
            
            // Use both actual text splitting and word-based estimation for comprehensive view
            const splitHeader = pdf.splitTextToSize(headerText, colWidth - 8)
            const estimatedHeaderLines = estimateLineCount(headerText, colWidth - 8, 9) // Comprehensive view font size
            
            // Use the more conservative estimate
            return Math.max(splitHeader.length, estimatedHeaderLines)
        })
        
        const maxHeaderLines = Math.max(1, ...headerLineHeights)
        const dynamicHeaderHeight = Math.max(12, maxHeaderLines * 6 + 8) // Better spacing for comprehensive view
        
        // Add space before header
        yPosition += 8
        
        // Draw header with borders and proper spacing
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin, yPosition, maxWidth, dynamicHeaderHeight, 'F')
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.5)
        
        let currentX = margin
        finalCompColumnWidths.forEach((colWidth) => {
            pdf.rect(currentX, yPosition, colWidth, dynamicHeaderHeight)
            currentX += colWidth
        })
        
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'bold')
        pdf.setTextColor(0, 0, 0)
        
        let xPosition = margin
        tableData.headers.forEach((header, index) => {
            const colWidth = finalCompColumnWidths[index]
            const headerText = String(header || 'Column ' + (index + 1)) // Fallback for empty headers
            const splitHeader = pdf.splitTextToSize(headerText, colWidth - 6) // More padding
            
            // Draw each line of wrapped header text with generous spacing
            splitHeader.forEach((line, lineIndex) => {
                const textY = yPosition + 8 + (lineIndex * 6) // More generous positioning and spacing
                if (textY <= yPosition + dynamicHeaderHeight - 4) {
                    pdf.text(line, xPosition + 5, textY) // More left padding
                }
            })
            xPosition += colWidth
        })
        yPosition += dynamicHeaderHeight + 6 // Add space after header

        // Draw rows with proper text wrapping (same as individual table logic)
        pdf.setFont('helvetica', 'normal')
        const dataToExport = tableData.data.slice(0, maxRows)
        
        dataToExport.forEach((row, rowIndex) => {
            // Calculate required height for this row based on word count and wrapping
            const rowContentHeights = row.map((cell, cellIndex) => {
                const colWidth = finalCompColumnWidths[cellIndex]
                const cellText = formatCellValue(cell)
                
                // Use both actual jsPDF splitting and our word-based estimation
                const splitText = pdf.splitTextToSize(cellText, colWidth - 6)
                const estimatedLines = estimateLineCount(cellText, colWidth - 6, 9) // Font size 9 for comprehensive
                
                // Use the more conservative estimate (higher line count) for better layout
                const finalLineCount = Math.max(splitText.length, estimatedLines, 1)
                return finalLineCount * 5 // 5 units per line for comprehensive view
            })
            const requiredRowHeight = Math.max(12, Math.max(...rowContentHeights))
            
            // Check if we need a new page (accounting for header space)
            const requiredSpaceWithHeader = requiredRowHeight + dynamicHeaderHeight + 20
            if (yPosition + requiredSpaceWithHeader > pageHeight - margin) {
                pdf.addPage()
                yPosition = 30
                
                // Redraw table header on new page with proper spacing
                yPosition += 8 // Space before header
                
                pdf.setFillColor(240, 240, 240)
                pdf.rect(margin, yPosition, maxWidth, dynamicHeaderHeight, 'F')
                pdf.setDrawColor(200, 200, 200)
                
                currentX = margin
                finalCompColumnWidths.forEach((colWidth) => {
                    pdf.rect(currentX, yPosition, colWidth, dynamicHeaderHeight)
                    currentX += colWidth
                })
                
                pdf.setFontSize(9) // Consistent font size
                pdf.setFont('helvetica', 'bold')
                xPosition = margin
                tableData.headers.forEach((header, index) => {
                    const colWidth = finalCompColumnWidths[index]
                    const headerText = String(header || 'Column ' + (index + 1))
                    const splitHeader = pdf.splitTextToSize(headerText, colWidth - 6)
                    
                    splitHeader.forEach((line, lineIndex) => {
                        const textY = yPosition + 8 + (lineIndex * 6) // Consistent with main header
                        if (textY <= yPosition + dynamicHeaderHeight - 4) {
                            pdf.text(line, xPosition + 5, textY) // Consistent padding
                        }
                    })
                    xPosition += colWidth
                })
                yPosition += dynamicHeaderHeight + 6 // Space after header
                pdf.setFont('helvetica', 'normal')
            }

            // Alternate row background
            if (rowIndex % 2 === 0) {
                pdf.setFillColor(250, 250, 250)
                pdf.rect(margin, yPosition - requiredRowHeight + 2, maxWidth, requiredRowHeight, 'F')
            }

            // Draw cell borders
            pdf.setDrawColor(220, 220, 220)
            pdf.setLineWidth(0.3)
            currentX = margin
            finalCompColumnWidths.forEach((colWidth) => {
                pdf.rect(currentX, yPosition - requiredRowHeight + 2, colWidth, requiredRowHeight)
                currentX += colWidth
            })

            pdf.setFontSize(9) // Improved content font size
            pdf.setTextColor(0, 0, 0)

            xPosition = margin
            row.forEach((cell, cellIndex) => {
                const colWidth = finalCompColumnWidths[cellIndex]
                const cellText = formatCellValue(cell)
                
                // Split text to fit column width with padding
                const splitText = pdf.splitTextToSize(cellText, colWidth - 6)
                
                // Draw each line of wrapped text
                const maxLinesPerCell = Math.min(5, Math.floor(requiredRowHeight / 5)) // More lines for comprehensive view
                splitText.forEach((line, lineIndex) => {
                    if (lineIndex < maxLinesPerCell) {
                        const textY = yPosition - requiredRowHeight + 6 + (lineIndex * 5)
                        pdf.text(line, xPosition + 3, textY)
                    }
                })
                
                // Add ellipsis if text was truncated
                if (splitText.length > maxLinesPerCell) {
                    const ellipsisY = yPosition - requiredRowHeight + 6 + ((maxLinesPerCell - 1) * 5)
                    pdf.text('...', xPosition + 3, ellipsisY)
                }
                
                xPosition += colWidth
            })
            yPosition += requiredRowHeight
        })

        if (tableData.data.length > maxRows) {
            yPosition += 5
            pdf.setFontSize(8)
            pdf.setFont('helvetica', 'italic')
            pdf.setTextColor(100, 100, 100)
            pdf.text(`... showing ${maxRows} of ${tableData.data.length} total rows (download table PDF for complete data)`, margin, yPosition)
        }
    }

    // Save the comprehensive PDF
    const filename = `opsvision-complete-response-${Date.now()}.pdf`
    pdf.save(filename)
}