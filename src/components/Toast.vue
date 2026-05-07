<template>
    <Teleport to="body">
        <div
            v-if="toasts.length > 0"
            class="fixed top-4 right-4 z-50 space-y-2"
        >
            <TransitionGroup
                name="toast"
                tag="div"
                class="space-y-2"
            >
                <div
                    v-for="toast in toasts"
                    :key="toast.id"
                    class="flex items-start space-x-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm max-w-sm"
                    :class="getToastClasses(toast.type)"
                >
                    <!-- Toast Icon -->
                    <div
                        class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                        :class="getIconClasses(toast.type)"
                    >
                        <!-- Success Icon -->
                        <svg
                            v-if="toast.type === 'success'"
                            class="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        
                        <!-- Error Icon -->
                        <svg
                            v-else-if="toast.type === 'error'"
                            class="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        
                        <!-- Info Icon -->
                        <svg
                            v-else-if="toast.type === 'info'"
                            class="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        
                        <!-- Warning Icon -->
                        <svg
                            v-else-if="toast.type === 'warning'"
                            class="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>

                    <!-- Toast Content -->
                    <div class="flex-1 min-w-0">
                        <h4
                            class="text-sm font-semibold"
                            :class="getTextClasses(toast.type).title"
                        >
                            {{ toast.title }}
                        </h4>
                        <p
                            class="text-sm mt-1"
                            :class="getTextClasses(toast.type).message"
                        >
                            {{ toast.message }}
                        </p>
                    </div>

                    <!-- Close Button -->
                    <button
                        @click="removeToast(toast.id)"
                        class="flex-shrink-0 ml-2 p-1 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        :class="getCloseButtonClasses(toast.type)"
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Toast state
const toasts = ref([])
let toastId = 0

// Toast type definitions
const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
}

// Methods
const addToast = (type, title, message, duration = 4000) => {
    const id = ++toastId
    const toast = {
        id,
        type,
        title,
        message,
        duration
    }
    
    toasts.value.push(toast)
    
    // Auto-remove toast after duration
    if (duration > 0) {
        setTimeout(() => {
            removeToast(id)
        }, duration)
    }
    
    return id
}

const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
        toasts.value.splice(index, 1)
    }
}

const clearAllToasts = () => {
    toasts.value = []
}

// Convenience methods for different toast types
const showSuccess = (title, message, duration) => {
    return addToast(TOAST_TYPES.SUCCESS, title, message, duration)
}

const showError = (title, message, duration) => {
    return addToast(TOAST_TYPES.ERROR, title, message, duration)
}

const showWarning = (title, message, duration) => {
    return addToast(TOAST_TYPES.WARNING, title, message, duration)
}

const showInfo = (title, message, duration) => {
    return addToast(TOAST_TYPES.INFO, title, message, duration)
}

// Styling helpers
const getToastClasses = (type) => {
    const base = 'border-l-4'
    switch (type) {
    case 'success':
        return `${base} bg-green-50 border-green-400`
    case 'error':
        return `${base} bg-red-50 border-red-400`
    case 'warning':
        return `${base} bg-yellow-50 border-yellow-400`
    case 'info':
        return `${base} bg-blue-50 border-blue-400`
    default:
        return `${base} bg-gray-50 border-gray-400`
    }
}

const getIconClasses = (type) => {
    switch (type) {
    case 'success':
        return 'bg-green-500'
    case 'error':
        return 'bg-red-500'
    case 'warning':
        return 'bg-yellow-500'
    case 'info':
        return 'bg-blue-500'
    default:
        return 'bg-gray-500'
    }
}

const getTextClasses = (type) => {
    switch (type) {
    case 'success':
        return {
            title: 'text-green-800',
            message: 'text-green-700'
        }
    case 'error':
        return {
            title: 'text-red-800',
            message: 'text-red-700'
        }
    case 'warning':
        return {
            title: 'text-yellow-800',
            message: 'text-yellow-700'
        }
    case 'info':
        return {
            title: 'text-blue-800',
            message: 'text-blue-700'
        }
    default:
        return {
            title: 'text-gray-800',
            message: 'text-gray-700'
        }
    }
}

const getCloseButtonClasses = (type) => {
    switch (type) {
    case 'success':
        return 'text-green-400 hover:text-green-600 focus:ring-green-500'
    case 'error':
        return 'text-red-400 hover:text-red-600 focus:ring-red-500'
    case 'warning':
        return 'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500'
    case 'info':
        return 'text-blue-400 hover:text-blue-600 focus:ring-blue-500'
    default:
        return 'text-gray-400 hover:text-gray-600 focus:ring-gray-500'
    }
}

// Expose methods for external use
defineExpose({
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    TOAST_TYPES
})
</script>

<style scoped>
/* Toast entrance and exit animations */
.toast-enter-active {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
}

.toast-move {
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Enhanced shadow and backdrop blur effects */
.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                0 4px 6px -2px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(0, 0, 0, 0.05);
}

.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Smooth hover and focus transitions */
button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom scrollbar for toast container (if needed) */
.space-y-2::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
</style>