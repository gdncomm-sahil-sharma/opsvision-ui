<template>
    <div class="w-full">
        <!-- User Message -->
        <div
            v-if="message.type === 'user'"
            class="flex justify-end mb-4"
        >
            <div class="max-w-4xl">
                <div class="bg-gray-100 rounded-2xl rounded-tr-md px-6 py-4">
                    <p class="text-gray-900 text-base leading-relaxed">
                        {{ message.content }}
                    </p>
                </div>
                <div class="text-right mt-1">
                    <span class="text-xs text-gray-400">{{ formatTime(message.timestamp) }}</span>
                </div>
            </div>
        </div>

        <!-- Assistant Message -->
        <div
            v-else
            class="flex justify-start mb-6"
        >
            <div class="max-w-6xl">
                <!-- Assistant Avatar -->
                <div class="flex items-start space-x-4 mb-2">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        <svg
                            class="w-5 h-5 text-white"
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
                </div>

                <!-- Loading State -->
                <div
                    v-if="message.loading"
                    class="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-6 py-4 animate-pulse-subtle"
                >
                    <div class="flex items-center space-x-3">
                        <div class="flex space-x-1">
                            <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                            <div
                                class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                                style="animation-delay: 0.2s"
                            />
                            <div
                                class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                                style="animation-delay: 0.4s"
                            />
                        </div>
                        <span class="text-gray-500 text-sm">Analyzing your query...</span>
                    </div>
                </div>

                <!-- Assistant Response Content -->
                <div
                    v-else
                    class="bg-white border border-gray-200 rounded-2xl rounded-tl-md"
                >
                    <!-- Text Response Section -->
                    <div
                        v-if="getResponseType(message.results).includes('text')"
                        class="px-6 py-5"
                    >
                        <AIBulletin
                            :key="message.results.data.textResponse.summary"
                            :data="message.results.data.textResponse"
                            :animate-text="false"
                            :animate-bullets="false"
                            :show-copy-button="true"
                            :show-timestamp="false"
                        />
                    </div>
                    
                    <!-- Subtle separator line -->
                    <div
                        v-if="getResponseType(message.results).includes('text') && getResponseType(message.results).includes('timelines')"
                        class="border-t border-gray-100"
                    ></div>
                    
                    <!-- Timeline Section -->
                    <div
                        v-if="getResponseType(message.results).includes('timelines')"
                        class="px-6 py-5"
                    >
                        <StatusBasedTimeline
                            :title="message.results.data.timelines.title"
                            :timelineData="message.results.data.timelines.data"
                        />
                    </div>
                </div>

                <div class="mt-1">
                    <span class="text-xs text-gray-400">{{ formatTime(message.timestamp) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { getResponseType } from '../utils/responseHelper.js'
import StatusBasedTimeline from './StatusBasedTimeline.vue'
import AIBulletin from './AIBulletin.vue'

defineProps({
    message: {
        type: Object,
        required: true
    }
})

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
@keyframes pulse-subtle {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.95;
        transform: scale(1.005);
    }
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
}
</style>
