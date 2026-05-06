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

        <!-- Spacer to push dark mode toggle to bottom -->
        <div class="flex-1" />

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
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/searchStore.js'
import { useThemeStore } from '../stores/theme.js'

// Reactive data
const isCollapsed = ref(false)

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

const toggleTheme = () => {
    themeStore.toggleDarkMode()
}
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
