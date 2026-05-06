<template>
    <div class="flex flex-col h-full relative">
        <!-- Scroll Progress Indicator -->
        <Transition name="fade">
            <div
                v-if="store.messages.length > 0 && isScrolling"
                class="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-10"
            >
                <div
                    class="h-full bg-gray-800 transition-all duration-150 ease-out"
                    :style="{ width: `${scrollProgress}%` }"
                />
            </div>
        </Transition>
        <!-- Chat Messages Area -->
        <div
            class="flex-1 overflow-y-auto"
            :class="store.messages.length === 0 ? 'px-6 py-4' : 'px-6 py-4 pb-32'"
            ref="messagesContainer"
            @scroll="handleScroll"
        >
            <!-- Welcome Message (when no messages) -->
            <Transition
                name="welcome-fade"
                appear
            >
                <div
                    v-if="store.messages.length === 0"
                    class="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center"
                >
                    <Transition
                        name="welcome-header"
                        appear
                    >
                        <div class="mb-12 mt-16">
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
                    </Transition>

                    <!-- Sample Questions -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-12">
                        <TransitionGroup
                            name="suggestion-stagger"
                            tag="div"
                            class="contents"
                            appear
                        >
                            <button
                                v-for="suggestion in suggestions"
                                :key="suggestion.id"
                                @click="handleSuggestionClick(suggestion.text)"
                                class="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all duration-300 text-left group transform hover:-translate-y-1"
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
                        </TransitionGroup>
                    </div>

                    <!-- Centered Chat Input (when no messages) -->
                    <Transition
                        name="welcome-input"
                        appear
                    >
                        <div class="w-full max-w-4xl mx-auto">
                            <div class="relative flex items-center">
                                <input
                                    v-model="store.inputMessage"
                                    type="text"
                                    placeholder="Ask anything about your warehouse operations..."
                                    class="w-full px-5 py-4 pr-14 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-lg text-lg transition-all duration-300 focus:shadow-xl focus:scale-[1.02]"
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
                    </Transition>
                </div>
            </Transition>

            <!-- Chat Messages -->
            <Transition
                name="chat-appear"
                appear
            >
                <div
                    v-if="store.messages.length > 0"
                    class="max-w-4xl mx-auto space-y-1"
                >
                    <TransitionGroup
                        name="message-slide"
                        tag="div"
                        class="space-y-1"
                        appear
                    >
                        <div
                            v-for="(message, index) in store.messages"
                            :key="message.id"
                            :ref="el => {
                                if (index === store.messages.length - 1) latestMessageRef = el
                                if (message.type === 'user' && isCurrentQueryPair(message, index)) currentQueryRef = el
                            }"
                        >
                            <ChatBubble :message="message" />
                        </div>
                    </TransitionGroup>
                </div>
            </Transition>
        </div>

        <!-- Scroll Controls -->
        <Transition
            name="fade"
            appear
        >
            <div
                v-if="store.messages.length > 2"
                class="fixed right-6 bottom-24 z-40"
            >
                <!-- Scroll to Current Query Button -->
                <button
                    @click="scrollToCurrentQuery"
                    class="w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    title="Scroll to current query"
                >
                    <svg
                        class="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </button>
            </div>
        </Transition>

        <!-- Fixed Chat Input Area (when messages exist) -->
        <Transition
            name="input-slide-up"
            appear
        >
            <div
                v-if="store.messages.length > 0"
                class="fixed bottom-0 right-0 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 z-50 transition-all duration-300"
                :style="{ left: sidebarCollapsed ? '4rem' : '16rem' }"
            >
                <div class="max-w-4xl mx-auto">
                    <div class="flex items-stretch space-x-2">
                        <div class="relative flex-1">
                            <input
                                v-model="store.inputMessage"
                                type="text"
                                placeholder="Ask anything about your warehouse operations..."
                                class="w-full h-12 px-4 pr-12 text-gray-900 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-sm transition-all duration-200 focus:shadow-md"
                                @keyup.enter="handleSendMessage"
                                :disabled="store.loading"
                            />
                            <button
                                @click="handleSendMessage"
                                :disabled="!store.inputMessage.trim() || store.loading"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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

                        <!-- Start Over Button (Icon Only) -->
                        <button
                            @click="handleNewSearch"
                            class="flex items-center justify-center w-12 h-12 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 cursor-pointer border border-gray-300"
                            title="Clear chat and start over"
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
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, nextTick, inject, watch, onMounted, onUnmounted } from 'vue'
import ChatBubble from './ChatBubble.vue'
import { useSearchStore } from '../stores/searchStore.js'

// Get sidebar collapsed state from parent
const sidebarCollapsed = inject('sidebarCollapsed', ref(false))

// Reactive data
const messagesContainer = ref(null)
const latestMessageRef = ref(null)
const currentQueryRef = ref(null)
const scrollProgress = ref(0)
const isScrolling = ref(false)

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

    // Clear input and scroll to current query
    const query = store.inputMessage.trim()
    store.clearInputMessage()
    await scrollToCurrentQuery()

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

        // Scroll to show the complete query-response pair
        await scrollToCurrentQuery()

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
        await scrollToCurrentQuery()
    }
}

const handleSuggestionClick = (suggestionText) => {
    store.setInputMessage(suggestionText)
    handleSendMessage()
}

const handleNewSearch = () => {
    store.clear()
}

// Helper function to check if a user message is part of the current query pair
const isCurrentQueryPair = (message, index) => {
    if (message.type !== 'user') return false
    // Check if this is one of the last two messages (user query + assistant response)
    return index >= store.messages.length - 2
}

// Scroll progress tracking
const updateScrollProgress = () => {
    if (!messagesContainer.value) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    const maxScroll = scrollHeight - clientHeight

    if (maxScroll > 0) {
        scrollProgress.value = (scrollTop / maxScroll) * 100
    } else {
        scrollProgress.value = 0
    }
}

const handleScroll = () => {
    updateScrollProgress()

    // Show scrolling indicator
    isScrolling.value = true
    // eslint-disable-next-line no-undef
    clearTimeout(handleScroll.timeout)
    // eslint-disable-next-line no-undef
    handleScroll.timeout = setTimeout(() => {
        isScrolling.value = false
    }, 150)
}

// Enhanced scroll functions

const scrollToLatestMessage = async () => {
    await nextTick()
    if (latestMessageRef.value && messagesContainer.value) {
        const containerRect = messagesContainer.value.getBoundingClientRect()
        const messageRect = latestMessageRef.value.getBoundingClientRect()

        // Check if message is not fully visible
        if (messageRect.bottom > containerRect.bottom || messageRect.top < containerRect.top) {
            latestMessageRef.value.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }
    }
}

const scrollToCurrentQuery = async () => {
    await nextTick()
    if (currentQueryRef.value && messagesContainer.value) {
        currentQueryRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        })
    }
}

// Watch for new messages and auto-scroll
watch(() => store.messages.length, async (newLength, oldLength) => {
    if (newLength > oldLength) {
        // Delay scroll slightly to ensure DOM is updated
        // eslint-disable-next-line no-undef
        setTimeout(() => {
            scrollToCurrentQuery()
        }, 100)
    }
}, { immediate: false })

// Keyboard shortcuts for scroll navigation
const handleKeydown = (event) => {
    // Ctrl/Cmd + Home: Scroll to current query
    if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
        event.preventDefault()
        scrollToCurrentQuery()
    }
    // Ctrl/Cmd + End: Scroll to latest message (keep for accessibility)
    if ((event.ctrlKey || event.metaKey) && event.key === 'End') {
        event.preventDefault()
        scrollToLatestMessage()
    }
}

// Mount and unmount lifecycle
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    // Initial scroll progress calculation
    if (messagesContainer.value) {
        updateScrollProgress()
    }
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (handleScroll.timeout) {
        // eslint-disable-next-line no-undef
        clearTimeout(handleScroll.timeout)
    }
})

</script>

<style scoped>
/* Welcome header animation */
.welcome-header-enter-active {
    transition: all 0.4s ease-out;
}

.welcome-header-enter-from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
}

/* Welcome screen fade animation */
.welcome-fade-enter-active {
    transition: all 0.3s ease-out;
}

.welcome-fade-leave-active {
    transition: all 0.3s ease-in;
}

.welcome-fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.welcome-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

/* Chat area appearance animation */
.chat-appear-enter-active {
    transition: all 0.4s ease-out 0.1s;
}

.chat-appear-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

/* Individual message slide animations */
.message-slide-enter-active {
    transition: all 0.3s ease-out;
}

.message-slide-leave-active {
    transition: all 0.2s ease-in;
}

.message-slide-enter-from {
    opacity: 0;
    transform: translateY(20px) translateX(-5px);
}

.message-slide-leave-to {
    opacity: 0;
    transform: translateY(-5px) translateX(5px);
}

.message-slide-move {
    transition: transform 0.2s ease-out;
}

/* Fixed input area slide up animation */
.input-slide-up-enter-active {
    transition: all 0.3s ease-out 0.15s;
}

.input-slide-up-leave-active {
    transition: all 0.25s ease-in;
}

.input-slide-up-enter-from {
    opacity: 0;
    transform: translateY(100%);
}

.input-slide-up-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

/* Suggestion staggered animation */
.suggestion-stagger-enter-active {
    transition: all 0.3s ease-out;
}

.suggestion-stagger-enter-from {
    opacity: 0;
    transform: translateY(25px) scale(0.95);
}

/* Add staggered delays for each suggestion */
.suggestion-stagger-enter-active:nth-child(1) { transition-delay: 0.05s; }
.suggestion-stagger-enter-active:nth-child(2) { transition-delay: 0.1s; }
.suggestion-stagger-enter-active:nth-child(3) { transition-delay: 0.15s; }
.suggestion-stagger-enter-active:nth-child(4) { transition-delay: 0.2s; }

/* Welcome input animation */
.welcome-input-enter-active {
    transition: all 0.4s ease-out 0.25s;
}

.welcome-input-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.98);
}

/* Smooth loading spinner animation enhancement */
@keyframes smooth-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.animate-spin {
    animation: smooth-spin 1s linear infinite;
}

/* Fade transition for scroll controls */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>
