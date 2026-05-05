<template>
    <div class="flex flex-col h-full relative">
        <!-- Chat Messages Area -->
        <div
            class="flex-1 overflow-y-auto"
            :class="messages.length === 0 ? 'px-6 py-4' : 'px-6 py-4 pb-32'"
            ref="messagesContainer"
        >
            <!-- Welcome Message (when no messages) -->
            <div
                v-if="messages.length === 0"
                class="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center"
            >
                <div class="mb-12">
                    <div class="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg
                            class="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1H3V4zm14 2v9a1 1 0 01-1 1H4a1 1 0 01-1-1V6h14zM6 8h8v2H6V8zm0 4h5v2H6v-2z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">
                        Welcome to OPSVISION
                    </h2>
                    <p class="text-gray-600 text-lg mb-8">
                        Ask anything about your warehouse operations and get instant insights
                    </p>
                </div>

                <!-- Sample Questions -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-12">
                    <button
                        v-for="suggestion in suggestions"
                        :key="suggestion.id"
                        @click="handleSuggestionClick(suggestion.text)"
                        class="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left group"
                    >
                        <div class="flex items-start space-x-3">
                            <div
                                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                :class="suggestion.iconBg"
                            >
                                <svg
                                    class="w-4 h-4"
                                    :class="suggestion.iconColor"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        :d="suggestion.iconPath"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-medium text-gray-900 group-hover:text-gray-700 mb-1">
                                    {{ suggestion.title }}
                                </h3>
                                <p class="text-sm text-gray-600 group-hover:text-gray-500">
                                    {{ suggestion.text }}
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Centered Chat Input (when no messages) -->
                <div class="w-full max-w-4xl mx-auto">
                    <div class="relative flex items-center">
                        <input
                            v-model="inputMessage"
                            type="text"
                            placeholder="Ask anything about your warehouse operations..."
                            class="w-full px-5 py-4 pr-14 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-lg text-lg"
                            @keyup.enter="handleSendMessage"
                            :disabled="isLoading"
                        />
                        <button
                            @click="handleSendMessage"
                            :disabled="!inputMessage.trim() || isLoading"
                            class="absolute right-3 p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            <svg
                                v-if="!isLoading"
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                            <div
                                v-else
                                class="w-4 h-4"
                            >
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Chat Messages -->
            <div
                v-else
                class="max-w-4xl mx-auto space-y-1"
            >
                <ChatBubble
                    v-for="message in messages"
                    :key="message.id"
                    :message="message"
                />
            </div>
        </div>

        <!-- Fixed Chat Input Area (when messages exist) -->
        <div
            v-if="messages.length > 0"
            class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 z-50"
        >
            <div class="max-w-4xl mx-auto">
                <div class="relative flex items-center">
                    <input
                        v-model="inputMessage"
                        type="text"
                        placeholder="Ask anything about your warehouse operations..."
                        class="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm"
                        @keyup.enter="handleSendMessage"
                        :disabled="isLoading"
                    />
                    <button
                        @click="handleSendMessage"
                        :disabled="!inputMessage.trim() || isLoading"
                        class="absolute right-2 p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <svg
                            v-if="!isLoading"
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                        <div
                            v-else
                            class="w-4 h-4"
                        >
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import ChatBubble from './ChatBubble.vue'

// Reactive data
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)

// Sample suggestions
const suggestions = ref([
    {
        id: 1,
        title: 'Performance Analysis',
        text: 'Show me today\'s warehouse performance metrics',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    },
    {
        id: 2,
        title: 'Order Status',
        text: 'What\'s the current status of pending orders?',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        id: 3,
        title: 'Inventory Check',
        text: 'Check inventory levels for low stock items',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
    },
    {
        id: 4,
        title: 'Alert Summary',
        text: 'Show me any current alerts or issues',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z'
    }
])

// Methods
const handleSendMessage = async () => {
    if (!inputMessage.value.trim() || isLoading.value) return

    const userMessage = {
        id: Date.now(),
        type: 'user',
        content: inputMessage.value.trim(),
        timestamp: new Date().toISOString()
    }

    // Add user message
    messages.value.push(userMessage)

    // Create loading assistant message
    const loadingMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        loading: true,
        timestamp: new Date().toISOString()
    }

    messages.value.push(loadingMessage)

    // Clear input and scroll to bottom
    const query = inputMessage.value.trim()
    inputMessage.value = ''
    isLoading.value = true
    await scrollToBottom()

    // Simulate API call
    setTimeout(() => {
        // Remove loading message
        messages.value = messages.value.filter(m => !m.loading)

        // Add assistant response
        const assistantMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            content: generateResponse(query),
            results: generateResults(query),
            timestamp: new Date().toISOString()
        }

        messages.value.push(assistantMessage)
        isLoading.value = false
        scrollToBottom()
    }, 2000)
}

const handleSuggestionClick = (suggestionText) => {
    inputMessage.value = suggestionText
    handleSendMessage()
}

const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes('performance') || lowerQuery.includes('metrics')) {
        return 'Here are your current warehouse performance metrics. Your picking rate is performing well above average, with excellent accuracy rates maintained throughout the day.'
    } else if (lowerQuery.includes('order') || lowerQuery.includes('status')) {
        return 'I\'ve analyzed your current order status. You have strong completion rates with most orders processing smoothly. There are a few orders in progress that are on track for timely completion.'
    } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
        return 'Your inventory levels are generally healthy. I\'ve identified some items that may need restocking soon. The system is efficiently tracking all inventory movements.'
    } else if (lowerQuery.includes('alert') || lowerQuery.includes('issue') || lowerQuery.includes('problem')) {
        return 'I\'ve found a few items that need attention. There are some minor SLA breaches and low inventory alerts that should be addressed soon to maintain optimal operations.'
    } else {
        return `I've analyzed your query about "${query}" and gathered the relevant operational data. Here are the key insights from your warehouse operations.`
    }
}

const generateResults = (query) => {
    const lowerQuery = query.toLowerCase()

    const results = {}

    if (lowerQuery.includes('performance') || lowerQuery.includes('metrics')) {
        results.performance = true
    }

    if (lowerQuery.includes('order') || lowerQuery.includes('status')) {
        results.orders = true
    }

    if (lowerQuery.includes('alert') || lowerQuery.includes('issue') || lowerQuery.includes('problem')) {
        results.alerts = true
    }

    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
        results.inventory = true
    }

    // If no specific category, show performance and orders by default
    if (Object.keys(results).length === 0) {
        results.performance = true
        results.orders = true
    }

    return results
}

const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// Expose methods for parent component
defineExpose({
    addMessage: (message) => {
        messages.value.push(message)
        scrollToBottom()
    },
    clearMessages: () => {
        messages.value = []
    }
})
</script>
