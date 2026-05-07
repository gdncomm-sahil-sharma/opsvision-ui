<template>
    <div class="flex items-center space-x-1">
        <!-- Like Button (show when no feedback or liked) -->
        <Transition
            name="button-fade"
            mode="out-in"
        >
            <button
                v-if="!isDisliked"
                @click="handleLike"
                :disabled="submittingFeedback"
                class="group p-1.5 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-500'"
            >
                <!-- Filled Like Icon (when liked) -->
                <svg
                    v-if="isLiked"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 1024 1024"
                    class="transition-all duration-200 scale-110"
                >
                    <path
                        fill="currentColor"
                        d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32"
                    />
                </svg>

                <!-- Unfilled Like Icon (when not liked) -->
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 1024 1024"
                    class="transition-all duration-200 group-hover:scale-110"
                >
                    <path
                        fill="currentColor"
                        d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"
                        stroke-width="25.5"
                        stroke="currentColor"
                    />
                </svg>
            </button>
        </Transition>

        <!-- Dislike Button (show when no feedback or disliked) -->
        <Transition
            name="button-fade"
            mode="out-in"
        >
            <button
                v-if="!isLiked"
                @click="handleDislike"
                :disabled="submittingFeedback"
                class="group p-1.5 transition-all duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
                :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-500'"
            >
                <!-- Filled Dislike Icon (when disliked) -->
                <svg
                    v-if="isDisliked"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 1024 1024"
                    class="transition-all duration-200 scale-110"
                >
                    <path
                        fill="currentColor"
                        d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37c0-28.3-9.3-55.5-26.1-77.7c3.6-12 5.4-24.4 5.4-37c0-28.3-9.3-55.5-26.1-77.7c3.6-12 5.4-24.4 5.4-37c0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H273v428h.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4c20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3c40.4-23.5 65.5-66.1 65.5-111c0-28.3-9.3-55.5-26.1-77.7M112 132v364c0 17.7 14.3 32 32 32h65V100h-65c-17.7 0-32 14.3-32 32"
                    />
                </svg>

                <!-- Unfilled Dislike Icon (when not disliked) -->
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 1024 1024"
                    class="transition-all duration-200 group-hover:scale-110"
                >
                    <path
                        fill="currentColor"
                        d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37c0-28.3-9.3-55.5-26.1-77.7c3.6-12 5.4-24.4 5.4-37c0-28.3-9.3-55.5-26.1-77.7c3.6-12 5.4-24.4 5.4-37c0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4c20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3c40.4-23.5 65.5-66.1 65.5-111c0-28.3-9.3-55.5-26.1-77.7M184 456V172h81v284zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5c-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4l21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4l21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5l21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4"
                        stroke-width="25.5"
                        stroke="currentColor"
                    />
                </svg>
            </button>
        </Transition>

        <!-- Loading Spinner -->
        <div
            v-if="submittingFeedback"
            class="ml-2 w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60"
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/theme.js'

const props = defineProps({
    messageId: {
        type: [String, Number],
        required: true
    },
    sequence: {
        type: Number,
        required: true
    },
    feedback: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['feedback-submitted', 'open-feedback-modal'])

const themeStore = useThemeStore()
const submittingFeedback = ref(false)

// Computed properties for current state
const isLiked = computed(() => props.feedback?.helpful === true)
const isDisliked = computed(() => props.feedback?.helpful === false)

const handleLike = () => {
    if (submittingFeedback.value) return

    if (isLiked.value) {
        // Already liked - reset (remove feedback)
        submitDirectFeedback(null)
    } else {
        // Not liked - show positive feedback modal
        emit('open-feedback-modal', {
            messageId: props.messageId,
            sequence: props.sequence,
            type: 'positive',
            helpful: true
        })
    }
}

const handleDislike = () => {
    if (submittingFeedback.value) return

    if (isDisliked.value) {
        // Already disliked - reset (remove feedback)
        submitDirectFeedback(null)
    } else {
        // Not disliked - show negative feedback modal
        emit('open-feedback-modal', {
            messageId: props.messageId,
            sequence: props.sequence,
            type: 'negative',
            helpful: false
        })
    }
}

const submitDirectFeedback = async (helpful) => {
    submittingFeedback.value = true

    try {
        // Emit direct feedback submission (for reset functionality)
        await emit('feedback-submitted', {
            messageId: props.messageId,
            sequence: props.sequence,
            helpful: helpful,
            comment: helpful === null ? '' : (helpful ? 'Positive feedback' : 'Negative feedback')
        })
    } catch (error) {
        console.error('Failed to submit feedback:', error)
    } finally {
        submittingFeedback.value = false
    }
}

// Expose method to show loading state
defineExpose({
    setLoading: () => {
        submittingFeedback.value = true
    },
    clearLoading: () => {
        submittingFeedback.value = false
    }
})
</script>

<style scoped>
/* Enhanced hover effects */
.group:hover svg {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Smooth color transitions */
button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Remove focus outline */
button:focus {
    outline: none;
}

/* Button transition animations */
.button-fade-enter-active,
.button-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-fade-enter-from,
.button-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.button-fade-enter-to,
.button-fade-leave-from {
    opacity: 1;
    transform: scale(1);
}

</style>
