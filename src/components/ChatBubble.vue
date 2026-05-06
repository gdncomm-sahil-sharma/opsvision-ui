<template>
    <div class="w-full">
        <!-- User Message -->
        <div
            v-if="message.type === 'user'"
            class="flex justify-end mb-4 first:mt-0"
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
            class="flex justify-start mb-6 first:mt-0"
        >
            <div class="max-w-4xl overflow-hidden">
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
                    class="bg-white border border-gray-200 rounded-2xl rounded-tl-md w-full max-w-full overflow-hidden"
                >
                    <!-- Error Message Section -->
                    <div
                        v-if="message.error"
                        class="px-6 py-5"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3 flex-1">
                                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                                    <svg
                                        class="w-5 h-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <p class="text-gray-900 text-base leading-relaxed">
                                        {{ message.content }}
                                    </p>
                                </div>
                            </div>
                            <button
                                @click="retryQuery(message.query)"
                                class="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                                title="Retry request"
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
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Text Response Section -->
                    <div
                        v-else-if="getResponseType(message.results).includes('text')"
                        class="px-6 py-5"
                    >
                        <AIBulletin
                            :key="message.results?.data?.textResponse?.summary"
                            :data="message.results?.data?.textResponse"
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
                    />

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

                    <!-- Separator line between timeline and table -->
                    <div
                        v-if="getResponseType(message.results).includes('timelines') && getResponseType(message.results).includes('table')"
                        class="border-t border-gray-100"
                    />

                    <div
                        v-if="getResponseType(message.results).includes('table')"
                        class="px-6 py-5 w-full max-w-full overflow-hidden"
                    >
                        <DataTable
                            :title="message.results.data.table.title"
                            :headers="message.results.data.table.headers"
                            :data="message.results.data.table.data"
                            :itemsPerPage="5"
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
import { defineProps, defineEmits } from 'vue'
import { getResponseType } from '../utils/responseHelper.js'
import StatusBasedTimeline from './StatusBasedTimeline.vue'
import AIBulletin from './AIBulletin.vue'
import DataTable from './DataTable.vue'

defineProps({
    message: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['retry-query'])

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const retryQuery = (query) => {
    emit('retry-query', query)
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
