<template>
    <div class="flex flex-col h-full relative">
        <!-- Scroll Progress Indicator -->
        <Transition name="fade">
            <div
                v-if="store.messages.length > 0 && isScrolling"
                class="absolute top-0 left-0 right-0 h-1 z-10"
                :class="themeStore.isDark ? 'bg-slate-700' : 'bg-gray-200'"
            >
                <div
                    class="h-full transition-all duration-150 ease-out"
                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-800'"
                    :style="{ width: `${scrollProgress}%` }"
                />
            </div>
        </Transition>
        <!-- Chat Messages Area -->
        <div
            class="flex-1 overflow-y-auto"
            :class="store.messages.length === 0 ? 'px-6 py-4' : 'px-6 py-4'"
            :style="store.messages.length > 0 ? { 'padding-bottom': 'calc(88px + env(safe-area-inset-bottom, 0px))' } : {}"
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
                            <div class="w-16 h-16 bg-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <img
                                    :src="themeStore.isDark ? '/src/assets/icons/app-dark.svg' : '/src/assets/icons/app-light.svg'"
                                    alt="OpsVision Warehouse Icon"
                                    class="w-10 h-10"
                                />
                            </div>
                            <h2
                                class="text-2xl font-semibold mb-2"
                                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                            >
                                Welcome to OPSVISION
                            </h2>
                            <p
                                class="text-lg mb-8"
                                :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-600'"
                            >
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
                                class="p-4 border rounded-xl hover:shadow-md transition-all duration-300 text-left group transform hover:-translate-y-1"
                                :class="themeStore.isDark
                                    ? 'bg-slate-800 border-slate-700 hover:border-slate-600 hover:bg-slate-700'
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
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
                                        <h3
                                            class="font-medium mb-1"
                                            :class="themeStore.isDark ? 'text-white group-hover:text-slate-200' : 'text-gray-900 group-hover:text-gray-700'"
                                        >
                                            {{ suggestion.title }}
                                        </h3>
                                        <p
                                            class="text-sm"
                                            :class="themeStore.isDark ? 'text-slate-300 group-hover:text-slate-400' : 'text-gray-600 group-hover:text-gray-500'"
                                        >
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
                                    class="w-full px-5 py-4 pr-14 border rounded-2xl focus:outline-none transition-all duration-300 text-lg"
                                    :class="themeStore.isDark
                                        ? 'text-white bg-slate-800 border-slate-600 placeholder-slate-400'
                                        : 'text-gray-900 bg-white border-gray-300'"
                                    @keyup.enter="handleSendMessage"
                                    :disabled="store.loading"
                                />
                                <button
                                    @click="handleSendMessage"
                                    :disabled="!store.inputMessage.trim() || store.loading"
                                    class="absolute right-3 p-2 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                    :class="themeStore.isDark
                                        ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-500 focus:ring-slate-500'
                                        : 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 focus:ring-gray-500'"
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
                    ref="messagesContentRef"
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
                            <ChatBubble
                                :message="message"
                                @retry-query="handleRetryQuery"
                            />
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
                    class="w-10 h-10 border rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
                    :class="themeStore.isDark
                        ? 'bg-slate-800 hover:bg-slate-700 border-slate-600 focus:ring-slate-400'
                        : 'bg-white hover:bg-gray-50 border-gray-200 focus:ring-gray-400'"
                    title="Scroll to current query"
                >
                    <svg
                        class="w-4 h-4"
                        :class="themeStore.isDark ? 'text-slate-300' : 'text-gray-600'"
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
                class="fixed bottom-0 right-0 px-6 py-4 z-50 transition-all duration-300 shadow-lg"
                :class="themeStore.isDark ? 'bg-slate-900' : 'bg-gray-50'"
                :style="{ left: sidebarCollapsed ? '4rem' : '16rem' }"
            >
                <div class="max-w-4xl mx-auto">
                    <div class="flex items-stretch space-x-2">
                        <div class="relative flex-1">
                            <input
                                v-model="store.inputMessage"
                                type="text"
                                placeholder="Ask anything about your warehouse operations..."
                                class="w-full h-12 px-4 pr-12 border rounded-2xl focus:outline-none transition-all duration-200"
                                :class="themeStore.isDark
                                    ? 'text-white bg-slate-800 border-slate-600 placeholder-slate-400'
                                    : 'text-gray-900 bg-white border-gray-300'"
                                @keyup.enter="handleSendMessage"
                                :disabled="store.loading"
                            />
                            <button
                                @click="handleSendMessage"
                                :disabled="!store.inputMessage.trim() || store.loading"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                :class="themeStore.isDark
                                    ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-500 focus:ring-slate-500'
                                    : 'bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 focus:ring-gray-500'"
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
        </Transition>

        <!-- Feedback Modal -->
        <FeedbackModal
            :is-open="feedbackModal.isOpen"
            :message-id="feedbackModal.messageId"
            :sequence="feedbackModal.sequence"
            :feedback-type="feedbackModal.type"
            :helpful="feedbackModal.helpful"
            @close="closeFeedbackModal"
            @submit="handleFeedbackSubmit"
        />

        <!-- Toast Notifications -->
        <Toast ref="toastRef" />
    </div>
</template>

<script setup>
import { ref, nextTick, inject, watch, onMounted, onUnmounted, provide } from 'vue'
import ChatBubble from './ChatBubble.vue'
import FeedbackModal from './FeedbackModal.vue'
import Toast from './Toast.vue'
import { useSearchStore } from '../stores/searchStore.js'
import { useThemeStore } from '../stores/theme.js'

// Get sidebar collapsed state from parent
const sidebarCollapsed = inject('sidebarCollapsed', ref(false))

// Reactive data
const messagesContainer = ref(null)
const messagesContentRef = ref(null)
const latestMessageRef = ref(null)
const currentQueryRef = ref(null)
const scrollProgress = ref(0)
const isScrolling = ref(false)
const toastRef = ref(null)

// Feedback modal state
const feedbackModal = ref({
    isOpen: false,
    messageId: null,
    sequence: null,
    type: 'positive', // 'positive' or 'negative'
    helpful: true
})

// Store
const store = useSearchStore()
const themeStore = useThemeStore()

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

    // Clear input and store query
    const query = store.inputMessage.trim()
    store.clearInputMessage()

    try {
        // Call the streaming search function (this adds the user message immediately)
        const searchPromise = store.streamSearch(query)

        // Scroll right after user message is added (very short delay)
        await nextTick()
        // eslint-disable-next-line no-undef
        setTimeout(() => {
            scrollToCurrentQuery() // Scroll current query to center
        }, 50)

        // Wait for the API call to complete
        await searchPromise
    } catch (error) {
        console.error('Chat error:', error)
        // Error handling is done in the store
    }
}

const handleSuggestionClick = (suggestionText) => {
    store.setInputMessage(suggestionText)
    handleSendMessage()
}

const handleRetryQuery = (query) => {
    // Set the query in the input and trigger send
    store.setInputMessage(query)
    handleSendMessage()
}

// Feedback methods
const openFeedbackModal = (feedbackData) => {
    feedbackModal.value = {
        isOpen: true,
        messageId: feedbackData.messageId,
        sequence: feedbackData.sequence,
        type: feedbackData.type,
        helpful: feedbackData.helpful
    }
}

const closeFeedbackModal = () => {
    feedbackModal.value.isOpen = false
}

const handleFeedbackSubmit = async (feedbackData) => {
    try {
        // Submit feedback through store
        await store.submitMessageFeedback(feedbackData.messageId, {
            helpful: feedbackData.helpful,
            comment: feedbackData.comment
        })

        // Show success toast
        showToast('success',
            'Thank you!',
            feedbackData.helpful
                ? 'Your positive feedback helps us improve our responses.'
                : 'Your feedback helps us understand what went wrong and improve.'
        )
    } catch (error) {
        console.error('Failed to submit feedback:', error)

        // Show error toast
        showToast('error',
            'Feedback Failed',
            'We couldn\'t save your feedback right now. Please try again later.'
        )
    }
}

const showToast = (type, title, message, duration = 4000) => {
    if (toastRef.value) {
        toastRef.value.addToast(type, title, message, duration)
    }
}

// Provide functions to child components
provide('openFeedbackModal', openFeedbackModal)
provide('showToast', showToast)

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
            block: 'center',
            inline: 'nearest'
        })
    }
}

// Watch for chat switching - always scroll to bottom
watch(() => store.currentChatId, async () => {
    // Always scroll to bottom when currentChatId changes
    // eslint-disable-next-line no-undef
    setTimeout(() => {
        scrollToCurrentQuery()
    }, 300)
}, { immediate: false })

// No automatic scrolling for new messages - only scroll when user explicitly sends a message

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

/* Quick suggestion chips animation */
.chips-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.chips-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.chips-fade-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
}

.chips-fade-leave-to {
    opacity: 0;
    transform: translateY(-5px) scale(0.98);
}

.chips-fade-enter-to,
.chips-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
