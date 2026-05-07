<template>
    <!-- Collapsible Sidebar -->
    <div
        :class="[
            'h-screen flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 shadow-sm',
            isCollapsed ? 'w-16' : 'w-64',
            themeStore.isDark ? 'bg-gray-900 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        ]"
    >
        <!-- Header with toggle button (expanded view) -->
        <div
            v-show="!isCollapsed"
            :class="[
                'flex items-center justify-between p-3',
                themeStore.isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
            ]"
        >
            <div class="flex items-center space-x-2">
                <div class="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
                    <img
                        :src="themeStore.isDark ? '/src/assets/icons/app-dark.svg' : '/src/assets/icons/app-light.svg'"
                        alt="OpsVision Icon"
                        class="w-5 h-5"
                    />
                </div>
                <span
                    :class="[
                        'font-semibold text-base',
                        themeStore.isDark ? 'text-white' : 'text-gray-900'
                    ]"
                >
                    OPSVISION
                </span>
            </div>

            <button
                @click="toggleSidebar"
                :class="[
                    'p-1.5 rounded-md transition-colors duration-200 cursor-pointer',
                    themeStore.isDark
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                ]"
                title="Close sidebar"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                </svg>
            </button>
        </div>

        <!-- Collapsed header with logo/expand toggle -->
        <div
            v-show="isCollapsed"
            :class="[
                'flex items-center justify-center p-3',
                themeStore.isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
            ]"
        >
            <div class="relative">
                <button
                    @click="toggleSidebar"
                    class="relative w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 group cursor-pointer"
                    title="Open sidebar"
                >
                    <!-- Logo (default state) -->
                    <img
                        :src="themeStore.isDark ? '/src/assets/icons/app-dark.svg' : '/src/assets/icons/app-light.svg'"
                        alt="OpsVision Icon"
                        class="w-5 h-5 transition-opacity duration-200 group-hover:opacity-0"
                    />

                    <!-- Expand icon (hover state) -->
                    <svg
                        class="w-4 h-4 text-white absolute inset-0 m-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                    </svg>
                </button>

                <!-- Tooltip -->
                <div
                    :class="[
                        'tooltip-arrow absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 group-hover:opacity-100',
                        themeStore.isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    ]"
                >
                    Open sidebar
                </div>
            </div>
        </div>

        <!-- New Chat Button - Unified with smooth transitions -->
        <div class="p-3">
            <div class="relative">
                <button
                    @click="handleNewChat"
                    :class="[
                        'flex items-center rounded-lg transition-all duration-300 focus:outline-none cursor-pointer group',
                        isCollapsed ? 'justify-center w-10 h-10' : 'w-full p-2.5',
                        themeStore.isDark
                            ? 'text-white bg-gray-800 hover:bg-gray-700'
                            : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                    ]"
                    :title="isCollapsed ? 'New chat' : 'Start a new chat'"
                    style="box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);"
                >
                    <svg
                        :class="[
                            'w-4 h-4 shrink-0 transition-all duration-300',
                            isCollapsed ? '' : ''
                        ]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                        />
                    </svg>

                    <!-- Text with horizontal expansion only -->
                    <div
                        :class="[
                            'overflow-hidden transition-all duration-300 ease-in-out flex items-center',
                            isCollapsed ? 'w-0 ml-0' : 'w-auto ml-2'
                        ]"
                    >
                        <span
                            :class="[
                                'font-medium text-sm whitespace-nowrap',
                                isCollapsed ? 'opacity-0' : 'opacity-100'
                            ]"
                            style="transition: opacity 300ms ease-in-out;"
                        >
                            New chat
                        </span>
                    </div>
                </button>

                <!-- Tooltip - only show in collapsed state -->
                <div
                    v-show="isCollapsed"
                    :class="[
                        'absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 group-hover:opacity-100',
                        themeStore.isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    ]"
                >
                    New chat
                </div>
            </div>
        </div>

        <!-- Chat History Section -->
        <div
            v-show="!isCollapsed"
            :class="[
                'flex-1 overflow-y-auto px-3',
                themeStore.isDark ? 'text-white' : 'text-gray-900'
            ]"
        >
            <!-- Chat History Header -->
            <div
                :class="[
                    'flex items-center justify-between text-xs font-medium uppercase tracking-wide mb-2 px-2',
                    themeStore.isDark ? 'text-gray-400' : 'text-gray-500'
                ]"
            >
                <span>Recent Chats</span>
                <button
                    @click="refreshChatHistory"
                    :disabled="store.loadingHistory"
                    :class="[
                        'p-1 rounded transition-colors duration-200',
                        store.loadingHistory
                            ? 'cursor-not-allowed opacity-50'
                            : (themeStore.isDark
                                ? 'cursor-pointer hover:bg-gray-700 hover:text-gray-200'
                                : 'cursor-pointer hover:bg-gray-200 hover:text-gray-700')
                    ]"
                    title="Refresh chat history"
                >
                    <svg
                        :class="[
                            'w-3 h-3 transition-transform duration-200',
                            store.loadingHistory ? 'animate-spin' : ''
                        ]"
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

            <!-- Loading State -->
            <div
                v-if="store.loadingHistory"
                class="flex items-center justify-center py-4"
            >
                <svg
                    class="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    />
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <span class="ml-2 text-sm text-gray-500">Loading...</span>
            </div>

            <!-- Error State -->
            <div
                v-else-if="store.historyError"
                :class="[
                    'text-sm px-2 py-1 rounded',
                    themeStore.isDark ? 'text-red-400' : 'text-red-600'
                ]"
            >
                Failed to load chat history
            </div>

            <!-- Chat History List -->
            <div
                v-else-if="store.chatHistory.length > 0"
                class="space-y-1"
            >
                <div
                    v-for="chat in store.chatHistory"
                    :key="chat.chatId"
                    :class="[
                        'group relative rounded-lg transition-all duration-200',
                        store.currentChatId === chat.chatId
                            ? (themeStore.isDark ? 'bg-gray-700' : 'bg-blue-50')
                            : (themeStore.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100')
                    ]"
                >
                    <!-- Chat Item -->
                    <div
                        v-if="editingChatId !== chat.chatId"
                        @click="handleChatSelect(chat.chatId)"
                        :class="[
                            'w-full text-left px-2 py-2 cursor-pointer relative',
                            store.currentChatId === chat.chatId
                                ? (themeStore.isDark ? 'text-white' : 'text-blue-900')
                                : (themeStore.isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900')
                        ]"
                    >
                        <!-- Chat Title (takes full width normally, adjusts on hover) -->
                        <div
                            :class="[
                                'text-sm font-medium truncate transition-all duration-200',
                                'group-hover:pr-16 pr-2'
                            ]"
                        >
                            {{ chat.title }}
                        </div>

                        <!-- Action Buttons (show on hover, positioned absolutely) -->
                        <div
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            @click.stop
                        >
                            <!-- Rename Button -->
                            <button
                                @click="startRename(chat.chatId, chat.title)"
                                :class="[
                                    'p-1 rounded transition-colors duration-200 cursor-pointer',
                                    themeStore.isDark
                                        ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-200'
                                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                                ]"
                                title="Rename chat"
                            >
                                <svg
                                    class="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </button>

                            <!-- Delete Button -->
                            <button
                                @click="confirmDelete(chat.chatId, chat.title)"
                                :class="[
                                    'p-1 rounded transition-colors duration-200 cursor-pointer',
                                    themeStore.isDark
                                        ? 'hover:bg-red-600 text-gray-400 hover:text-red-200'
                                        : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                                ]"
                                title="Delete chat"
                            >
                                <svg
                                    class="w-3 h-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Edit Mode -->
                    <div
                        v-else
                        class="px-2 py-2 relative chat-edit-container"
                        ref="editContainer"
                    >
                        <input
                            v-model="editingTitle"
                            @keyup.enter="saveRename(chat.chatId)"
                            @keyup.escape="cancelRename"
                            :class="[
                                'w-full text-sm font-medium bg-transparent border rounded px-2 py-1 pr-8 focus:outline-none focus:ring-1',
                                themeStore.isDark
                                    ? 'border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'
                                    : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                            ]"
                            ref="editInput"
                            maxlength="255"
                        />

                        <!-- Save Button (Checkmark) - Inside input -->
                        <button
                            @click="saveRename(chat.chatId)"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 cursor-pointer text-gray-400 hover:text-green-600"
                            title="Save changes"
                        >
                            <svg
                                class="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div
                v-else
                :class="[
                    'text-sm text-center py-4 px-2',
                    themeStore.isDark ? 'text-gray-500' : 'text-gray-400'
                ]"
            >
                No chat history
            </div>
        </div>

        <!-- Spacer to push dark mode toggle to bottom when collapsed -->
        <div
            v-show="isCollapsed"
            class="flex-1"
        />

        <!-- Dark/Light Mode Toggle Button at Bottom -->
        <div
            :class="[
                'p-3',
                themeStore.isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'
            ]"
        >
            <div class="relative">
                <button
                    @click="toggleTheme"
                    :class="[
                        'flex items-center rounded-lg transition-all duration-300 focus:outline-none cursor-pointer group',
                        isCollapsed ? 'justify-center w-10 h-10' : 'w-full p-2.5',
                        themeStore.isDark
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    ]"
                    :title="isCollapsed ? (themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode') : ''"
                >
                    <!-- Light mode icon (sun) -->
                    <svg
                        v-if="themeStore.isDark"
                        class="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                    <!-- Dark mode icon (moon) -->
                    <svg
                        v-else
                        class="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>

                    <!-- Text with horizontal expansion only -->
                    <div
                        :class="[
                            'overflow-hidden transition-all duration-300 ease-in-out flex items-center',
                            isCollapsed ? 'w-0 ml-0' : 'w-auto ml-2'
                        ]"
                    >
                        <span
                            :class="[
                                'font-medium text-sm whitespace-nowrap',
                                isCollapsed ? 'opacity-0' : 'opacity-100'
                            ]"
                            style="transition: opacity 300ms ease-in-out;"
                        >
                            {{ themeStore.isDark ? 'Light mode' : 'Dark mode' }}
                        </span>
                    </div>
                </button>

                <!-- Tooltip - only show in collapsed state -->
                <div
                    v-show="isCollapsed"
                    :class="[
                        'absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 group-hover:opacity-100',
                        themeStore.isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                    ]"
                >
                    {{ themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
                </div>
            </div>
        </div>

        <!-- Toast Container -->
        <Toast ref="toastRef" />

        <!-- Confirm Dialog -->
        <ConfirmDialog
            ref="confirmDialogRef"
            title="Delete Chat"
            message="Are you sure you want to delete this chat? This action cannot be undone."
            confirm-text="Delete"
            :loading="deleteLoading"
            @confirm="handleDeleteConfirm"
            @cancel="handleDeleteCancel"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/searchStore.js'
import { useThemeStore } from '../stores/theme.js'
import { renameChat, archiveChat } from '../api.js'
import Toast from './Toast.vue'
import ConfirmDialog from './ConfirmDialog.vue'

// Reactive data
const isCollapsed = ref(false)
const toastRef = ref(null)
const confirmDialogRef = ref(null)
const editingChatId = ref(null)
const editingTitle = ref('')
const deleteLoading = ref(false)
const editContainer = ref(null)

// Router and Store
const router = useRouter()
const store = useSearchStore()
const themeStore = useThemeStore()

// Define emits
const emit = defineEmits(['toggle'])

// Methods
const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
    emit('toggle', isCollapsed.value)
}

const handleNewChat = () => {
    // Clear the current chat when starting a new one
    store.clear()
    // Navigate to chat route
    router.push('/chat')
}

const handleChatSelect = async (chatId) => {
    try {
        // Load the selected chat's messages
        await store.loadChatMessages(chatId)
        // Navigate to chat route
        router.push('/chat')
    } catch (error) {
        console.error('Failed to load chat:', error)
        showToast('error', 'Chat Load Failed', 'Unable to load the selected chat. Please try again.')
    }
}

const refreshChatHistory = async () => {
    try {
        await store.fetchChatHistory()
        showToast('success', 'Refreshed', 'Chat history updated successfully.')
    } catch (error) {
        console.error('Failed to refresh chat history:', error)
        showToast('error', 'Refresh Failed', 'Unable to refresh chat history. Please check your connection and try again.')
    }
}

const showToast = (type, title, message, duration = 4000) => {
    if (toastRef.value) {
        toastRef.value.addToast(type, title, message, duration)
    }
}

// Rename functionality
const startRename = (chatId, currentTitle) => {
    // Remove any existing listener first
    document.removeEventListener('click', handleClickOutside, true)

    editingChatId.value = chatId
    editingTitle.value = currentTitle

    // Add click outside listener after a delay
    // eslint-disable-next-line no-undef
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true)
        console.log('Added click listener') // Debug log
    }, 300) // Increased delay

    // Focus and select the input
    // eslint-disable-next-line no-undef
    setTimeout(() => {
        const inputs = document.querySelectorAll('input[ref="editInput"]')
        if (inputs.length > 0) {
            inputs[0].focus()
            inputs[0].select()
        }
    }, 100)
}

const cancelRename = () => {
    document.removeEventListener('click', handleClickOutside, true)
    editingChatId.value = null
    editingTitle.value = ''
}

const saveRename = async (chatId) => {
    const newTitle = editingTitle.value.trim()

    // Validation
    if (!newTitle) {
        showToast('error', 'Invalid Title', 'Chat title cannot be empty.')
        return
    }

    if (newTitle.length > 255) {
        showToast('error', 'Title Too Long', 'Chat title must be 255 characters or less.')
        return
    }

    try {
        await renameChat(chatId, 'demo-user', newTitle)

        // Update the chat in the history
        store.updateChatInHistory(chatId, { title: newTitle })

        showToast('success', 'Chat Renamed', 'Chat title updated successfully.')
        cancelRename()
    } catch (error) {
        console.error('Failed to rename chat:', error)
        showToast('error', 'Rename Failed', 'Unable to rename the chat. Please try again.')
        // Still exit edit mode on error
        cancelRename()
    }
}

// Handle click outside edit mode
const handleClickOutside = (event) => {
    if (!editingChatId.value) return

    const target = event.target

    // Check if clicking inside edit container
    const editElement = target.closest('.chat-edit-container')
    if (editElement) {
        return // Stay in edit mode
    }

    // Click is outside edit area, cancel the edit (revert changes)
    console.log('Clicking outside, canceling edit') // Debug log
    cancelRename()
}

// Delete functionality
let chatToDelete = null

const confirmDelete = (chatId, chatTitle) => {
    chatToDelete = { chatId, chatTitle }
    confirmDialogRef.value?.show()
}

const handleDeleteConfirm = async () => {
    if (!chatToDelete) return

    deleteLoading.value = true

    try {
        await archiveChat(chatToDelete.chatId, 'demo-user')

        // If this was the current chat, clear it
        if (store.currentChatId === chatToDelete.chatId) {
            store.clear()
        }

        // Refresh chat history instead of manual removal
        await store.fetchChatHistory()

        showToast('success', 'Chat Deleted', `"${chatToDelete.chatTitle}" has been deleted.`)
        confirmDialogRef.value?.hide()
        chatToDelete = null
    } catch (error) {
        console.error('Failed to delete chat:', error)
        showToast('error', 'Delete Failed', 'Unable to delete the chat. Please try again.')
    } finally {
        deleteLoading.value = false
    }
}

const handleDeleteCancel = () => {
    chatToDelete = null
}

const toggleTheme = () => {
    themeStore.toggleDarkMode()
}

// Load chat history on component mount
onMounted(async () => {
    try {
        await store.fetchChatHistory()
    } catch (error) {
        console.error('Failed to fetch chat history on mount:', error)
    }
})

// Cleanup on unmount
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside, true)
})

</script>

<style scoped>
/* Scrollbar styles */
::-webkit-scrollbar {
    width: 6px;
}

/* Light theme scrollbar */
::-webkit-scrollbar-track {
    background: #f9fafb;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Dark theme scrollbar */
.dark ::-webkit-scrollbar-track {
    background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
}

/* Tooltip with arrow - Light theme */
.tooltip-arrow::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #111827;
}

/* Tooltip with arrow - Dark theme */
.dark .tooltip-arrow::before {
    border-right-color: #374151;
}
</style>
