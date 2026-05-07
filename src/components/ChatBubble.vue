<template>
    <div class="w-full">
        <!-- User Message -->
        <div
            v-if="props.message.type === 'user'"
            class="flex justify-end mb-4 first:mt-0"
        >
            <div class="max-w-4xl">
                <div
                    class="rounded-2xl rounded-tr-md px-6 py-4"
                    :class="themeStore.isDark ? 'bg-slate-700' : 'bg-gray-100'"
                >
                    <p
                        class="text-base leading-relaxed"
                        :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                    >
                        {{ props.message.content }}
                    </p>
                </div>
                <div class="text-right mt-1">
                    <span
                        class="text-xs"
                        :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-400'"
                    >
                        {{ formatTime(props.message.timestamp) }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Assistant Message -->
        <div
            v-else
            class="flex justify-start mb-6 first:mt-0"
        >
            <div class="max-w-4xl overflow-hidden">
                <!-- Assistant Avatar and Actions -->
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-start space-x-4">
                        <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            :class="themeStore.isDark ? 'bg-slate-700' : 'bg-gray-800'"
                        >
                            <img
                                :src="themeStore.isDark ? '/src/assets/icons/app-dark.svg' : '/src/assets/icons/app-light.svg'"
                                alt="OpsVision Icon"
                                class="w-6 h-6"
                            />
                        </div>
                    </div>

                    <!-- Response Actions -->
                    <div
                        v-if="!props.message.loading && !props.message.error && hasAnyStreamingComponents(props.message)"
                        class="flex items-center gap-2"
                    >
                    </div>
                </div>

                <!-- Assistant Response Content (Always show for streaming components) -->
                <div
                    class="border rounded-2xl rounded-tl-md w-full max-w-full overflow-hidden"
                    :class="themeStore.isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'"
                >
                    <!-- Loading State (only at the top when still loading) -->
                    <div
                        v-if="props.message.loading"
                        class="px-6 py-4"
                    >
                        <div class="flex items-center space-x-3">
                            <div class="flex space-x-1">
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                />
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                    style="animation-delay: 0.2s"
                                />
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                    style="animation-delay: 0.4s"
                                />
                            </div>
                            <span
                                class="text-sm"
                                :class="themeStore.isDark ? 'text-slate-300' : 'text-gray-500'"
                            >
                                {{ getLoadingText(props.message) }}
                            </span>
                        </div>

                        <!-- Tool Call Status -->
                        <div
                            v-if="props.message.toolCalls && props.message.toolCalls.length > 0"
                            class="mt-3 space-y-2"
                        >
                            <div
                                v-for="tool in props.message.toolCalls"
                                :key="tool.toolName"
                                class="flex items-center space-x-2 text-xs"
                            >
                                <div
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="getToolStatusClass(tool.status)"
                                />
                                <span :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-500'">
                                    {{ tool.toolName }}
                                    <span v-if="tool.status === 'SUCCESS'">✓</span>
                                    <span v-else-if="tool.status === 'FAILED'">✗</span>
                                    <span v-else-if="tool.status === 'CACHE_HIT'">⚡</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Separator after loading state if there are streaming components -->
                    <div
                        v-if="props.message.loading && hasAnyStreamingComponents(props.message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />
                    <!-- Error Message Section -->
                    <div
                        v-if="props.message.error"
                        class="px-6 py-5"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3 flex-1">
                                <div
                                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    :class="themeStore.isDark ? 'bg-red-900/30' : 'bg-red-100'"
                                >
                                    <svg
                                        class="w-5 h-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p
                                        class="text-base leading-relaxed"
                                        :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                                    >
                                        {{ props.message.content }}
                                    </p>
                                </div>
                            </div>
                            <button
                                @click="retryQuery(props.message.query)"
                                class="ml-3 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                :class="themeStore.isDark
                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700 focus:ring-slate-400'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-400'"
                                title="Retry request"
                            >
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Streaming Text Response Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTextResponse(props.message)"
                            class="px-6 py-5"
                        >
                            <AIBulletin
                                :key="getTextResponseKey(props.message)"
                                :data="getTextResponseData(props.message)"
                                :query="props.message.query"
                                :animate-text="false"
                                :animate-bullets="false"
                                :show-copy-button="false"
                                :show-timestamp="false"
                            />
                        </div>
                    </Transition>

                    <!-- Subtle separator line -->
                    <div
                        v-if="hasStreamingTextResponse(props.message) && hasStreamingTimeline(props.message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />

                    <!-- Streaming Timeline Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTimeline(props.message)"
                            class="px-6 py-5"
                        >
                            <StatusBasedTimeline
                                :title="getTimelineData(props.message).title"
                                :timelineData="getTimelineData(props.message).data"
                            />
                        </div>
                    </Transition>

                    <!-- Separator line between timeline and table -->
                    <div
                        v-if="hasStreamingTimeline(props.message) && hasStreamingTable(props.message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />

                    <!-- Streaming Table Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTable(props.message)"
                            class="px-6 py-5 w-full max-w-full overflow-hidden"
                        >
                            <DataTable
                                :title="getTableData(props.message).title"
                                :headers="getTableData(props.message).headers"
                                :data="getTableData(props.message).data"
                                :query="props.message.query"
                                :itemsPerPage="5"
                            />
                        </div>
                    </Transition>
                </div>

                <!-- Actions Section (only for completed assistant messages) -->
                <div
                    v-if="!props.message.loading && !props.message.error && hasAnyStreamingComponents(props.message)"
                    class="mt-3 flex items-center space-x-1"
                >
                    <!-- Copy Button -->
                    <button
                        @click="copyCompleteResponse"
                        class="group p-1.5 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                        :class="themeStore.isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'"
                    >
                        <!-- Copy Icon (default state) -->
                        <svg
                            v-if="!isJustCopied"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="transition-all duration-200 group-hover:scale-110"
                        >
                            <rect
                                width="14"
                                height="14"
                                x="8"
                                y="8"
                                rx="2"
                                ry="2"
                            />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        
                        <!-- Checkmark Icon (copied state) -->
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            class="transition-all duration-200 scale-110"
                        >
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </button>

                    <!-- Feedback Buttons -->
                    <FeedbackButtons
                        ref="feedbackButtonsRef"
                        :message-id="props.message.id"
                        :sequence="getMessageSequence(props.message)"
                        :feedback="props.message.feedback"
                        @open-feedback-modal="handleOpenFeedbackModal"
                        @feedback-submitted="handleFeedbackSubmitted"
                    />

                    <!-- Download Button with Dropdown -->
                    <div
                        v-if="hasStreamingTable(props.message) || hasMultipleStreamingComponentTypes(props.message)"
                        class="download-dropdown relative"
                    >
                        <button
                            class="group p-1.5 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                            :class="themeStore.isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'"
                        >
                            <!-- Download Icon -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                class="transition-all duration-200 group-hover:scale-110"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div class="download-menu" :class="{ 'dark-theme': themeStore.isDark }">
                            <button
                                v-if="hasStreamingTable(props.message)"
                                @click="downloadCompleteResponseExcel"
                                class="download-option"
                                :class="{ 'dark-theme': themeStore.isDark }"
                            >
                                Export as Excel
                            </button>
                            <button
                                v-if="hasMultipleStreamingComponentTypes(props.message)"
                                @click="downloadCompleteResponsePDF"
                                class="download-option"
                                :class="{ 'dark-theme': themeStore.isDark }"
                            >
                                Export as PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div class="mt-1">
                    <span
                        class="text-xs"
                        :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-400'"
                    >
                        {{ formatTime(props.message.timestamp) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, inject } from 'vue'
import { getResponseType } from '../utils/responseHelper.js'
import StatusBasedTimeline from './StatusBasedTimeline.vue'
import AIBulletin from './AIBulletin.vue'
import DataTable from './DataTable.vue'
import FeedbackButtons from './FeedbackButtons.vue'
import { useThemeStore } from '../stores/theme.js'
import { useSearchStore } from '../stores/searchStore.js'
import { generateComprehensivePDF } from '../utils/pdfExport.js'
import { generateComprehensiveExcel } from '../utils/excelExport.js'

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['retry-query'])
const themeStore = useThemeStore()
const searchStore = useSearchStore()

// Inject functions from parent (ChatContainer)
const openFeedbackModal = inject('openFeedbackModal', null)
const showToast = inject('showToast', null)

// Refs
const feedbackButtonsRef = ref(null)
const isJustCopied = ref(false)

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const retryQuery = (query) => {
    emit('retry-query', query)
}

// Streaming helper functions
const getLoadingText = (message) => {
    if (message.streaming) {
        if (message.toolCalls?.some(tool => tool.status === 'running')) {
            return 'Processing tools...'
        }
        return 'Analyzing your query...'
    }
    return 'Analyzing your query...'
}

const getToolStatusClass = (status) => {
    switch (status) {
    case 'SUCCESS':
        return 'bg-green-500'
    case 'FAILED':
        return 'bg-red-500'
    case 'CACHE_HIT':
        return 'bg-blue-500'
    case 'running':
    default:
        return 'bg-yellow-500 animate-pulse'
    }
}

// Streaming component detection helpers
const hasStreamingTextResponse = (message) => {
    return message.streamingComponents?.textResponse ||
        (message.results?.data?.textResponse && getResponseType(message.results).includes('text'))
}

const hasStreamingTimeline = (message) => {
    const timelineData = message.streamingComponents?.timeline || message.results?.data?.timelines
    return timelineData && timelineData.data && timelineData.data.length > 0
}

const hasStreamingTable = (message) => {
    const tableData = message.streamingComponents?.table || message.results?.data?.table
    return tableData && tableData.data && tableData.data.length > 0
}

const hasAnyStreamingComponents = (message) => {
    return hasStreamingTextResponse(message) ||
        hasStreamingTimeline(message) ||
        hasStreamingTable(message)
}

const countStreamingComponentTypes = (message) => {
    let count = 0
    if (hasStreamingTextResponse(message)) count++
    if (hasStreamingTimeline(message)) count++
    if (hasStreamingTable(message)) count++
    return count
}

const hasMultipleStreamingComponentTypes = (message) => {
    return countStreamingComponentTypes(message) >= 2
}

// Streaming data getters
const getTextResponseData = (message) => {
    return message.streamingComponents?.textResponse || message.results?.data?.textResponse
}

const getTextResponseKey = (message) => {
    const data = getTextResponseData(message)
    return data?.summary || message.id
}

const getTimelineData = (message) => {
    const timelineData = message.streamingComponents?.timeline || message.results?.data?.timelines || { title: '', data: [] }
    
    // Convert YYYYMMDD dates to epoch timestamps for StatusBasedTimeline
    if (timelineData.data && Array.isArray(timelineData.data)) {
        const processedData = timelineData.data.map(item => {
            if (item.date && String(item.date).length === 8 && /^\d{8}$/.test(String(item.date))) {
                // Convert YYYYMMDD to epoch timestamp
                const dateStr = String(item.date)
                const year = parseInt(dateStr.substring(0, 4))
                const month = parseInt(dateStr.substring(4, 6)) - 1 // month is 0-indexed
                const day = parseInt(dateStr.substring(6, 8))
                const epochTimestamp = new Date(year, month, day).getTime()
                
                return {
                    ...item,
                    date: epochTimestamp
                }
            }
            return item
        })
        
        return {
            ...timelineData,
            data: processedData
        }
    }
    
    return timelineData
}

const getTableData = (message) => {
    return message.streamingComponents?.table || message.results?.data?.table || { title: '', headers: [], data: [] }
}

// Feedback handling methods
const getMessageSequence = (message) => {
    // Calculate sequence number for assistant messages
    const assistantMessages = searchStore.messages.filter(m => m.type === 'assistant')
    const messageIndex = assistantMessages.findIndex(m => m.id === message.id)
    return messageIndex + 1 // 1-based sequence
}

const handleOpenFeedbackModal = (feedbackData) => {
    if (openFeedbackModal) {
        openFeedbackModal(feedbackData)
    }
}

const handleFeedbackSubmitted = async (feedbackData) => {
    try {
        // Show loading state on feedback buttons
        if (feedbackButtonsRef.value) {
            feedbackButtonsRef.value.setLoading()
        }

        // Submit feedback through store
        await searchStore.submitMessageFeedback(feedbackData.messageId, feedbackData)

        // Show success toast only if feedback was actually set (not reset)
        if (showToast && feedbackData.helpful !== null) {
            showToast('success',
                'Thank you!',
                feedbackData.helpful
                    ? 'Your positive feedback helps us improve.'
                    : 'Your feedback helps us understand what went wrong.'
            )
        }

    } catch (error) {
        console.error('Failed to submit feedback:', error)

        // Show error toast
        if (showToast) {
            showToast('error',
                'Feedback Failed',
                'We couldn\'t save your feedback right now. Please try again later.'
            )
        }
    } finally {
        // Clear loading state on feedback buttons
        if (feedbackButtonsRef.value) {
            feedbackButtonsRef.value.clearLoading()
        }
    }
}

const downloadCompleteResponsePDF = async () => {
    try {
        await generateComprehensivePDF(props.message)
    } catch (error) {
        console.error('Failed to generate comprehensive PDF:', error)
        // You could add a toast notification here
    }
}

const downloadCompleteResponseExcel = async () => {
    try {
        await generateComprehensiveExcel(props.message)
    } catch (error) {
        console.error('Failed to generate comprehensive Excel file:', error)
        // You could add a toast notification here
    }
}

const copyCompleteResponse = async () => {
    try {
        let fullResponse = ''


        // Add text response if available
        if (hasStreamingTextResponse(props.message)) {
            const textData = getTextResponseData(props.message)
            if (textData?.summary) {
                fullResponse += `${textData.summary}\n\n`
            }
            if (textData?.bullets && textData.bullets.length > 0) {
                textData.bullets.forEach(bullet => {
                    fullResponse += `• ${bullet}\n`
                })
                fullResponse += '\n'
            }
        }

        // Add timeline as table if available
        if (hasStreamingTimeline(props.message)) {
            const timelineData = getTimelineData(props.message)
            if (timelineData?.title) {
                fullResponse += `## ${timelineData.title}\n\n`
            }

            if (timelineData?.data && timelineData.data.length > 0) {
                // Use fixed headers for timeline: Date, Title, Description, Status
                const headerLabels = ['Date', 'Title', 'Description', 'Status']
                
                // Helper function to format cell values
                const formatTimelineCell = (value) => {
                    if (value === null || value === undefined || value === '' || value === 'null') {
                        return '-'
                    }
                    return String(value)
                }
                
                // Create timeline table header
                fullResponse += '| ' + headerLabels.join(' | ') + ' |\n'
                fullResponse += '|' + headerLabels.map(() => '-------').join('|') + '|\n'

                // Add timeline data rows
                timelineData.data.forEach(item => {
                    // Handle date formatting
                    let formattedDate = item.date
                    if (item.date) {
                        try {
                            const numValue = Number(item.date)
                            
                            // Check if it's a Unix timestamp in milliseconds (13 digits, > 1000000000000)
                            if (!isNaN(numValue) && numValue > 1000000000000) {
                                const date = new Date(numValue)
                                formattedDate = date.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })
                            }
                            // Check if it's a YYYYMMDD format (like 20260507)
                            else if (String(item.date).length === 8 && /^\d{8}$/.test(String(item.date))) {
                                const dateStr = String(item.date)
                                const year = dateStr.substring(0, 4)
                                const month = dateStr.substring(4, 6)
                                const day = dateStr.substring(6, 8)
                                const date = new Date(year, month - 1, day) // month is 0-indexed
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
                                } else {
                                    formattedDate = '-'
                                }
                            }
                        } catch (e) {
                            console.error('Failed to parse date:', item.date, e)
                            formattedDate = '-'
                        }
                    }
                    
                    // Create row with fixed column mapping
                    const rowData = [
                        formatTimelineCell(formattedDate),
                        formatTimelineCell(item.title),
                        formatTimelineCell(item.description || item.desc || item.details),
                        formatTimelineCell(item.status)
                    ]
                    
                    fullResponse += '| ' + rowData.join(' | ') + ' |\n'
                })
                fullResponse += '\n'
            }
        }

        // Add table data if available
        if (hasStreamingTable(props.message)) {
            const tableData = getTableData(props.message)
            if (tableData?.title) {
                fullResponse += `## ${tableData.title}\n\n`
            }

            if (tableData?.headers && tableData?.data && tableData.data.length > 0) {
                // Create table header
                const headers = tableData.headers
                fullResponse += '| ' + headers.join(' | ') + ' |\n'
                fullResponse += '|' + headers.map(() => '----------').join('|') + '|\n'

                // Add table data rows - expecting array of arrays format
                tableData.data.forEach(row => {
                    if (Array.isArray(row)) {
                        // Handle array format: [label, value]
                        const rowData = row.map(cell => {
                            let value = cell
                            
                            // Handle null, empty, or "null" string values
                            if (value === null || value === undefined || value === '' || value === 'null') {
                                return '-'
                            }
                            
                            // Handle date formatting if the cell looks like a date
                            if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                try {
                                    const date = new Date(value)
                                    if (!isNaN(date.getTime())) {
                                        value = date.toLocaleDateString()
                                    }
                                } catch (e) {
                                    // Keep original value if date parsing fails
                                }
                            }
                            
                            return String(value)
                        })
                        fullResponse += '| ' + rowData.join(' | ') + ' |\n'
                    } else {
                        // Fallback to object format for backwards compatibility
                        const rowData = headers.map(header => {
                            let value = row[header]
                            
                            // Handle date formatting for Date columns
                            if (header.toLowerCase().includes('date') && value && value !== 'N/A') {
                                try {
                                    if (typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}/)) {
                                        const date = new Date(value)
                                        if (!isNaN(date.getTime())) {
                                            value = date.toLocaleString()
                                        }
                                    }
                                } catch (e) {
                                    // Keep original value if date parsing fails
                                }
                            }
                            
                            return value !== undefined && value !== null ? String(value) : 'N/A'
                        })
                        fullResponse += '| ' + rowData.join(' | ') + ' |\n'
                    }
                })
                fullResponse += '\n'
            }
        }

        // Copy to clipboard
        if (fullResponse.trim()) {
            await navigator.clipboard.writeText(fullResponse.trim())
            
            // Show checkmark icon
            isJustCopied.value = true
            
            // Reset to copy icon after 2 seconds
            // eslint-disable-next-line no-undef
            setTimeout(() => {
                isJustCopied.value = false
            }, 2000)
        }
    } catch (error) {
        console.error('Failed to copy complete response:', error)
        // Could add error handling here if needed
    }
}

</script>

<style scoped>
@keyframes pulse-subtle {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.95;
        transform: scale(1.005);
    }
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
}

/* Slide-fade animation for streaming components */
.slide-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}

/* Download Dropdown */
.download-dropdown {
    position: relative;
}

.download-menu {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%) translateX(8px);
    border-radius: 8px;
    padding: 4px 0;
    min-width: 140px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 1000;
}

/* Theme-aware background colors */
.download-menu {
    background-color: white; /* Light background for light mode */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.download-menu.dark-theme {
    background-color: #374151; /* Dark grey for dark mode */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Create invisible bridge between button and menu */
.download-menu::before {
    content: '';
    position: absolute;
    top: 0;
    left: -12px;
    bottom: 0;
    width: 16px;
    background: transparent;
    pointer-events: auto;
    z-index: 999;
}

/* Show menu on hover of either dropdown container or menu itself */
.download-dropdown:hover .download-menu {
    opacity: 1;
    pointer-events: auto;
}

/* Keep menu visible when hovering over the menu itself */
.download-menu:hover {
    opacity: 1;
    pointer-events: auto;
}

.download-option {
    display: block;
    width: 100%;
    padding: 10px 16px;
    text-align: left;
    background: none;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #374151; /* Dark grey text for light mode */
    position: relative;
    z-index: 1001;
    margin: 0;
    line-height: 1.2;
}

.download-option.dark-theme {
    color: #f3f4f6; /* Light grey text for dark mode */
}

.download-option:hover {
    background-color: rgba(0, 0, 0, 0.05); /* Light hover for light mode */
}

.download-option:focus {
    outline: none;
    background-color: rgba(0, 0, 0, 0.05);
}

.download-option.dark-theme:hover,
.download-option.dark-theme:focus {
    background-color: rgba(255, 255, 255, 0.1); /* Light hover for dark mode */
}

/* Add subtle separator between dropdown items */
.download-option:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.download-option.dark-theme:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

</style>
