<template>
    <div class="flex flex-col h-full relative">
        <!-- Chat Messages Area -->
        <div
            class="flex-1 overflow-y-auto"
            :class="store.messages.length === 0 ? 'px-6 py-4' : 'px-6 py-4 pb-32'"
            ref="messagesContainer"
        >
            <!-- Welcome Message (when no messages) -->
            <div
                v-if="store.messages.length === 0"
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
                            v-model="store.inputMessage"
                            type="text"
                            placeholder="Ask anything about your warehouse operations..."
                            class="w-full px-5 py-4 pr-14 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-lg text-lg"
                            @keyup.enter="handleSendMessage"
                            :disabled="store.loading"
                        />
                        <button
                            @click="handleSendMessage"
                            :disabled="!store.inputMessage.trim() || store.loading"
                            class="absolute right-3 p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            <svg
                                v-if="!store.loading"
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
                    v-for="message in store.messages"
                    :key="message.id"
                    :message="message"
                />
            </div>
        </div>

        <!-- Fixed Chat Input Area (when messages exist) -->
        <div
            v-if="store.messages.length > 0"
            class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 z-50"
        >
            <div class="max-w-4xl mx-auto">
                <div class="relative flex items-center">
                    <input
                        v-model="store.inputMessage"
                        type="text"
                        placeholder="Ask anything about your warehouse operations..."
                        class="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm"
                        @keyup.enter="handleSendMessage"
                        :disabled="store.loading"
                    />
                    <button
                        @click="handleSendMessage"
                        :disabled="!store.inputMessage.trim() || store.loading"
                        class="absolute right-2 p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <svg
                            v-if="!store.loading"
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
import { ref, nextTick } from 'vue'
import ChatBubble from './ChatBubble.vue'
import { useSearchStore } from '../stores/searchStore.js'

// Reactive data
const messagesContainer = ref(null)

// Store
const store = useSearchStore()

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
    if (!store.inputMessage.trim() || store.loading) return

    const userMessage = {
        id: Date.now(),
        type: 'user',
        content: store.inputMessage.trim(),
        timestamp: new Date().toISOString()
    }

    // Add user message
    store.addMessage(userMessage)

    // Create loading assistant message
    const loadingMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        loading: true,
        timestamp: new Date().toISOString()
    }

    store.addMessage(loadingMessage)

    // Clear input and scroll to bottom
    const query = store.inputMessage.trim()
    store.clearInputMessage()
    await scrollToBottom()

    try {
        // Call the actual API through the store
        console.log('🚀 Making API call for query:', query)
        await store.search(query)

        console.log('✅ API call completed. Results:', store.results)

        // Remove loading message
        store.removeLoadingMessages()

        // Add assistant response based on API results - create independent copy
        const assistantMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            query: query, // Store the original query
            content: store.error
                ? `Sorry, I encountered an error: ${store.error}`
                : store.results?.response || `I've processed your query about "${query}" and retrieved the relevant data.`,
            results: store.results ? JSON.parse(JSON.stringify(store.results)) : null, // Deep copy
            timestamp: new Date().toISOString()
        }

        store.addMessage(assistantMessage)
        console.log('✅ Message added with independent results:', {
            messageId: assistantMessage.id,
            query: assistantMessage.query,
            hasResults: !!assistantMessage.results,
            resultsTimestamp: assistantMessage.results?.timestamp
        })
        await scrollToBottom()

    } catch (error) {
        // Remove loading message
        store.removeLoadingMessages()

        // Add error message
        const errorMessage = {
            id: Date.now() + 2,
            type: 'assistant',
            query: query, // Store the original query
            content: `Sorry, I encountered an error while processing your request: ${error.message}`,
            error: error.message,
            results: null,
            timestamp: new Date().toISOString()
        }

        store.addMessage(errorMessage)
        await scrollToBottom()
    }
}

const handleSuggestionClick = (suggestionText) => {
    store.setInputMessage(suggestionText)
    handleSendMessage()
}

const scrollToBottom = async () => {
    await nextTick()
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

</script>
