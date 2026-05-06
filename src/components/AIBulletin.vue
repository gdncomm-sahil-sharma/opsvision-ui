<template>
    <div class="w-full">
        <!-- Header with AI icon -->
        <div class="flex items-center gap-3 pb-3 mb-4 border-b border-gray-200/40 dark:border-gray-700/40">
            <span
                class="text-sm font-semibold flex-1"
                :class="themeStore.isDark ? 'text-white' : 'text-slate-900'"
            >
                AI Response
            </span>
            <button
                v-if="showCopyButton"
                class="p-1 rounded text-gray-500 cursor-pointer dark:text-gray-400 transition-colors duration-300"
                @click="copyToClipboard"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <!-- Main box (always visible) -->
                    <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                        stroke="currentColor"
                        stroke-width="1.5"
                        :fill="justCopied ? 'currentColor' : 'none'"
                        class="transition-all duration-300"
                    />

                    <!-- Copy lines (hidden when copied) -->
                    <path
                        v-if="!justCopied"
                        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                        stroke="currentColor"
                        stroke-width="1.5"
                        class="transition-opacity duration-300"
                        style="opacity: 1"
                    />

                    <!-- Checkmark (shown when copied, positioned inside the main box) -->
                    <path
                        v-if="justCopied"
                        d="M13 15.5l1.5 1.5 3-3"
                        stroke="white"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="transition-opacity duration-300"
                        style="opacity: 1"
                    />
                </svg>
            </button>
        </div>

        <!-- Main content -->
        <div>
            <!-- Main message with typing animation -->
            <div class="mb-6">
                <p
                    v-if="!animateText"
                    class="text-[15px] leading-relaxed m-0 font-medium"
                    :class="themeStore.isDark ? 'text-gray-200' : 'text-slate-900'"
                >
                    {{ data.summary }}
                </p>
                <p
                    v-else
                    class="text-[15px] leading-relaxed m-0 font-medium"
                    :class="themeStore.isDark ? 'text-gray-200' : 'text-slate-900'"
                >
                    {{ displayedText }}
                </p>
            </div>

            <!-- Bullet bullets -->
            <div
                v-if="data.bullets && data.bullets.length > 0"
                class="flex flex-col gap-2"
            >
                <div
                    v-for="(point, index) in data.bullets"
                    :key="index"
                    class="flex items-start gap-3 opacity-0 translate-y-2 transition-all duration-400 ease-out"
                    :class="{ 'opacity-100! translate-y-0!': !animateBullets || (animateBullets && index <= visiblebullets) }"
                    :style="{ transitionDelay: `${index * 0.3}s` }"
                >
                    <div class="relative w-1.5 h-1.5 mt-2.5 shrink-0">
                        <div class="w-full h-full bg-gray-400/70 rounded-full dark:bg-gray-500/60" />
                    </div>
                    <span
                        class="text-sm leading-relaxed font-medium"
                        :class="themeStore.isDark ? 'text-gray-300' : 'text-slate-800'"
                    >
                        {{ point }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Footer with timestamp -->
        <div
            v-if="showTimestamp"
            class="pt-3 mt-4 border-t border-gray-200/40 dark:border-gray-700/40"
        >
            <span class="text-xs text-gray-500 font-medium dark:text-gray-400">{{ formattedTime }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { useThemeStore } from '../stores/theme.js'

const props = defineProps({
    data: {
        type: Object,
        required: true,
        default: () => ({
            summary: '',
            bullets: []
        })
    },
    animateText: {
        type: Boolean,
        default: true
    },
    animateBullets: {
        type: Boolean,
        default: true
    },
    showCopyButton: {
        type: Boolean,
        default: true
    },
    showTimestamp: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['copy'])

const themeStore = useThemeStore()
const displayedText = ref('')
const visiblebullets = ref(-1)
const formattedTime = ref('')
const justCopied = ref(false)

let typingInterval = null

const typeText = () => {
    if (!props.animateText || !props.data.summary) {
        displayedText.value = props.data.summary
        // Always trigger bullets animation, regardless of text animation
        showbullets()
        return
    }

    const text = props.data.summary
    let charIndex = 0

    // Start bullets animation immediately if bullets should always animate
    if (props.animateBullets) {
        showbullets()
    }

    typingInterval = window.setInterval(() => {
        if (charIndex <= text.length) {
            displayedText.value = text.substring(0, charIndex)
            charIndex++
        } else {
            window.clearInterval(typingInterval)
            // Only trigger bullets if they weren't already triggered
            if (!props.animateBullets) {
                showbullets()
            }
        }
    }, 30)
}

const showbullets = () => {
    if (!props.data.bullets || props.data.bullets.length === 0) return

    if (!props.animateBullets) {
        // Show all bullets immediately if animation is disabled
        visiblebullets.value = props.data.bullets.length - 1
        return
    }

    let pointIndex = 0
    const pointInterval = window.setInterval(() => {
        if (pointIndex < props.data.bullets.length) {
            visiblebullets.value = pointIndex
            pointIndex++
        } else {
            window.clearInterval(pointInterval)
        }
    }, 300)
}

const copyToClipboard = async () => {
    const textToCopy = `${props.data.summary}\n\n${props.data.bullets ? props.data.bullets.map(point => `• ${point}`).join('\n') : ''}`

    try {
        await window.navigator.clipboard.writeText(textToCopy)
        justCopied.value = true
        emit('copy', textToCopy)

        // Reset to copy icon after 2 seconds
        window.setTimeout(() => {
            justCopied.value = false
        }, 2000)
    } catch (error) {
        console.warn('Failed to copy to clipboard:', error)
    }
}

const updateTimestamp = () => {
    const now = new Date()
    formattedTime.value = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    updateTimestamp()
    typeText()
})
</script>

<style scoped>
/* Custom animations that Tailwind doesn't provide by default */
@keyframes iconGlow {
    0%, 100% {
        opacity: 0.8;
    }
    50% {
        opacity: 1;
    }
}

@keyframes dotPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.8;
    }
    50% {
        transform: scale(1.2);
        opacity: 1;
    }
}
</style>
