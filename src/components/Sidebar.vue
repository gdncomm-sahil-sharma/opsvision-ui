<template>
    <!-- Collapsible Sidebar -->
    <div
        :class="[
            'bg-white h-screen flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-50 border-r border-gray-200 shadow-sm',
            isCollapsed ? 'w-16' : 'w-64'
        ]"
    >
        <!-- Header with toggle button (expanded view) -->
        <div
            v-show="!isCollapsed"
            class="flex items-center justify-between p-3 border-b border-gray-200"
        >
            <div class="flex items-center space-x-2">
                <div class="w-7 h-7 bg-gray-800 rounded-lg flex items-center justify-center">
                    <svg
                        class="w-4 h-4 text-white"
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
                <span class="font-semibold text-base text-gray-900">OPSVISION</span>
            </div>

            <button
                @click="toggleSidebar"
                class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer"
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
            class="flex items-center justify-center p-3 border-b border-gray-200"
        >
            <div class="relative">
                <button
                    @click="toggleSidebar"
                    class="relative w-7 h-7 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 group cursor-pointer"
                    title="Open sidebar"
                >
                    <!-- Logo (default state) -->
                    <svg
                        class="w-4 h-4 text-white transition-opacity duration-200 group-hover:opacity-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1H3V4zm14 2v9a1 1 0 01-1 1H4a1 1 0 01-1-1V6h14zM6 8h8v2H6V8zm0 4h5v2H6v-2z"
                            clip-rule="evenodd"
                        />
                    </svg>

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
                <div class="tooltip-arrow absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 group-hover:opacity-100">
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
                        'flex items-center text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 focus:outline-none cursor-pointer group',
                        isCollapsed ? 'justify-center w-10 h-10' : 'w-full p-2.5'
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
                    class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 group-hover:opacity-100"
                >
                    New chat
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/searchStore.js'

// Reactive data
const isCollapsed = ref(false)

// Router and Store
const router = useRouter()
const store = useSearchStore()

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
</script>

<style scoped>
/* Light theme scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

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

/* Tooltip with arrow */
.tooltip-arrow::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #111827;
}
</style>
