<template>
    <!-- Modal Overlay -->
    <Teleport to="body">
        <Transition
            name="modal-overlay"
            appear
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                @click.self="handleClose"
            >
                <!-- Modal Content -->
                <Transition
                    name="modal-content"
                    appear
                >
                    <div
                        class="w-full max-w-md rounded-2xl shadow-2xl"
                        :class="themeStore.isDark ? 'bg-slate-800' : 'bg-white'"
                        @click.stop
                    >
                        <!-- Modal Header -->
                        <div class="px-6 py-4">
                            <div class="flex items-center justify-between">
                                <h3
                                    class="text-lg font-semibold"
                                    :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                                >
                                    {{ modalTitle }}
                                </h3>
                                <!-- Close Button -->
                                <button
                                    @click="handleClose"
                                    class="p-1 rounded-lg transition-colors duration-200 focus:outline-none"
                                    :class="themeStore.isDark
                                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Modal Body -->
                        <div class="px-6 py-4">
                            <!-- Feedback Categories -->
                            <div class="mb-4">
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="option in currentOptions"
                                        :key="option.value"
                                        @click="toggleOption(option.value)"
                                        class="px-3 py-2 text-sm rounded-full border transition-all duration-200"
                                        :class="[
                                            selectedOptions.includes(option.value)
                                                ? 'bg-gray-900 text-white border-gray-900'
                                                : themeStore.isDark
                                                    ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        ]"
                                    >
                                        {{ option.label }}
                                    </button>
                                </div>
                            </div>

                            <!-- Comment Section -->
                            <div>
                                <textarea
                                    v-model="comment"
                                    rows="4"
                                    placeholder="Share details (optional)"
                                    class="w-full px-3 py-3 border rounded-lg resize-none transition-colors duration-200 focus:outline-none focus:ring-1 focus:border-transparent"
                                    :class="themeStore.isDark
                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-slate-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-gray-400'"
                                    maxlength="500"
                                />
                            </div>

                            <!-- Disclaimer -->
                            <div
                                class="mt-4 p-3 rounded-lg text-xs"
                                :class="themeStore.isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-50 text-gray-600'"
                            >
                                Your conversation will be included with your feedback to help improve OpsVision.
                            </div>
                        </div>

                        <!-- Modal Footer -->
                        <div class="px-6 py-4 flex justify-end space-x-2">
                            <button
                                @click="handleSubmit"
                                :disabled="isSubmitting"
                                class="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                            >
                                <div
                                    v-if="isSubmitting"
                                    class="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                                />
                                <span>{{ isSubmitting ? 'Submitting...' : 'Submit' }}</span>
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../stores/theme.js'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    messageId: {
        type: [String, Number],
        default: null
    },
    sequence: {
        type: Number,
        default: null
    },
    feedbackType: {
        type: String,
        default: 'positive', // 'positive' or 'negative'
        validator: (value) => ['positive', 'negative'].includes(value)
    },
    helpful: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close', 'submit'])

const themeStore = useThemeStore()
const selectedOptions = ref([])
const comment = ref('')
const isSubmitting = ref(false)

// Positive feedback options (ChatGPT style)
const positiveOptions = [
    { value: 'helpful', label: 'Helpful' },
    { value: 'accurate', label: 'Accurate' },
    { value: 'well_formatted', label: 'Well formatted' },
    { value: 'comprehensive', label: 'Comprehensive' },
    { value: 'good_context', label: 'Good context understanding' }
]

// Negative feedback options (ChatGPT style)
const negativeOptions = [
    { value: 'incorrect', label: 'Incorrect or incomplete' },
    { value: 'not_what_asked', label: 'Not what I asked for' },
    { value: 'slow_buggy', label: 'Slow or buggy' },
    { value: 'style_tone', label: 'Style or tone' },
    { value: 'safety_legal', label: 'Safety or legal concern' },
    { value: 'other', label: 'Other' }
]

// Computed properties
const modalTitle = computed(() => {
    return props.feedbackType === 'positive'
        ? 'Share feedback'
        : 'Share feedback'
})

const currentOptions = computed(() => {
    return props.feedbackType === 'positive' ? positiveOptions : negativeOptions
})

// Methods
const handleClose = () => {
    if (!isSubmitting.value) {
        resetForm()
        emit('close')
    }
}

const handleSubmit = async () => {
    if (isSubmitting.value) return

    isSubmitting.value = true

    try {
        // Prepare feedback data
        const feedbackData = {
            helpful: props.helpful,
            comment: buildFeedbackComment()
        }

        // Emit submit event
        await emit('submit', {
            messageId: props.messageId,
            sequence: props.sequence,
            ...feedbackData
        })

        // Reset form and close modal
        resetForm()
        emit('close')
    } catch (error) {
        console.error('Failed to submit feedback:', error)
    } finally {
        isSubmitting.value = false
    }
}

const toggleOption = (value) => {
    const index = selectedOptions.value.indexOf(value)
    if (index > -1) {
        selectedOptions.value.splice(index, 1)
    } else {
        selectedOptions.value.push(value)
    }
}

const buildFeedbackComment = () => {
    const parts = []

    if (selectedOptions.value.length > 0) {
        const selectedLabels = selectedOptions.value.map(value => {
            const option = currentOptions.value.find(opt => opt.value === value)
            return option ? option.label : value
        })
        parts.push(`Categories: ${selectedLabels.join(', ')}`)
    }

    if (comment.value.trim()) {
        parts.push(`Comment: ${comment.value.trim()}`)
    }

    return parts.join(' | ') || (props.feedbackType === 'positive' ? 'Positive feedback' : 'Negative feedback')
}

const resetForm = () => {
    selectedOptions.value = []
    comment.value = ''
    isSubmitting.value = false
}

// Watch for modal opening to reset form
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        resetForm()
    }
})
</script>

<style scoped>
/* Modal overlay animation */
.modal-overlay-enter-active,
.modal-overlay-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-overlay-enter-from,
.modal-overlay-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

/* Modal content animation */
.modal-content-enter-active,
.modal-content-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z'/%3e%3c/svg%3e");
}

/* Smooth hover transitions */
label {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus ring enhancements */
textarea:focus,
input[type="checkbox"]:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
