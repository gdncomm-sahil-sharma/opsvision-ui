<template>
    <Teleport to="body">
        <Transition name="modal-overlay">
            <div
                v-if="isVisible"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click="handleBackdropClick"
            >
                <Transition name="modal-content">
                    <div
                        v-if="isVisible"
                        :class="[
                            'w-full max-w-md rounded-2xl shadow-2xl p-6',
                            themeStore.isDark ? 'bg-slate-800' : 'bg-white'
                        ]"
                        @click.stop
                    >
                        <!-- Icon -->
                        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                            <svg
                                class="w-6 h-6 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>

                        <!-- Title -->
                        <h3
                            :class="[
                                'text-lg font-medium text-center mb-2',
                                themeStore.isDark ? 'text-white' : 'text-gray-900'
                            ]"
                        >
                            {{ title }}
                        </h3>

                        <!-- Message -->
                        <p
                            :class="[
                                'text-sm text-center !mb-4',
                                themeStore.isDark ? 'text-gray-300' : 'text-gray-500'
                            ]"
                        >
                            {{ message }}
                        </p>

                        <!-- Actions -->
                        <div class="flex space-x-4">
                            <button
                                @click="handleCancel"
                                :class="[
                                    'flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200',
                                    themeStore.isDark
                                        ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600'
                                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                ]"
                            >
                                Cancel
                            </button>
                            <button
                                @click="handleConfirm"
                                :disabled="loading"
                                class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span
                                    v-if="loading"
                                    class="flex items-center justify-center"
                                >
                                    <svg
                                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                    Deleting...
                                </span>
                                <span v-else>{{ confirmText }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../stores/theme.js'

const themeStore = useThemeStore()

// Props
const props = defineProps({
    title: {
        type: String,
        default: 'Confirm Action'
    },
    message: {
        type: String,
        default: 'Are you sure you want to proceed?'
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    loading: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['confirm', 'cancel'])

// State
const isVisible = ref(false)

// Methods
const show = () => {
    isVisible.value = true
}

const hide = () => {
    isVisible.value = false
}

const handleConfirm = () => {
    emit('confirm')
}

const handleCancel = () => {
    emit('cancel')
    hide()
}

const handleBackdropClick = () => {
    if (!props.loading) {
        handleCancel()
    }
}

// Expose methods
defineExpose({
    show,
    hide
})
</script>

<style scoped>
/* Modal overlay transitions */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
    transition: opacity 0.3s ease;
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
    opacity: 0;
}

/* Modal content transitions */
.modal-content-enter-active {
    transition: all 0.3s ease;
}

.modal-content-leave-active {
    transition: all 0.2s ease;
}

.modal-content-enter-from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}

.modal-content-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}
</style>
