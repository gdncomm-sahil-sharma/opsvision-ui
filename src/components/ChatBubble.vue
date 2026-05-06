<template>
    <div class="w-full">
        <!-- User Message -->
        <div
            v-if="message.type === 'user'"
            class="flex justify-end mb-4 first:mt-0"
        >
            <div class="max-w-4xl">
                <div
                    class="rounded-2xl rounded-tr-md px-6 py-4"
                    :class="themeStore.isDark ? 'bg-slate-700' : 'bg-gray-100'"
                >
                    <p
                        class="text-base leading-relaxed"
                        :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                    >
                        {{ message.content }}
                    </p>
                </div>
                <div class="text-right mt-1">
                    <span
                        class="text-xs"
                        :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-400'"
                    >
                        {{ formatTime(message.timestamp) }}
                    </span>
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
                    <div
                        class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        :class="themeStore.isDark ? 'bg-slate-700' : 'bg-gray-800'"
                    >
                        <img
                            :src="themeStore.isDark ? '/src/assets/icons/app-dark.svg' : '/src/assets/icons/app-light.svg'"
                            alt="OpsVision Icon"
                            class="w-6 h-6"
                        />
                    </div>
                </div>

                <!-- Assistant Response Content (Always show for streaming components) -->
                <div
                    class="border rounded-2xl rounded-tl-md w-full max-w-full overflow-hidden"
                    :class="themeStore.isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'"
                >
                    <!-- Loading State (only at the top when still loading) -->
                    <div
                        v-if="message.loading"
                        class="px-6 py-4"
                    >
                        <div class="flex items-center space-x-3">
                            <div class="flex space-x-1">
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                />
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                    style="animation-delay: 0.2s"
                                />
                                <div
                                    class="w-2 h-2 rounded-full animate-pulse"
                                    :class="themeStore.isDark ? 'bg-slate-400' : 'bg-gray-400'"
                                    style="animation-delay: 0.4s"
                                />
                            </div>
                            <span
                                class="text-sm"
                                :class="themeStore.isDark ? 'text-slate-300' : 'text-gray-500'"
                            >
                                {{ getLoadingText(message) }}
                            </span>
                        </div>

                        <!-- Tool Call Status -->
                        <div
                            v-if="message.toolCalls && message.toolCalls.length > 0"
                            class="mt-3 space-y-2"
                        >
                            <div
                                v-for="tool in message.toolCalls"
                                :key="tool.toolName"
                                class="flex items-center space-x-2 text-xs"
                            >
                                <div
                                    class="w-1.5 h-1.5 rounded-full"
                                    :class="getToolStatusClass(tool.status)"
                                />
                                <span :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-500'">
                                    {{ tool.toolName }}
                                    <span v-if="tool.status === 'SUCCESS'">✓</span>
                                    <span v-else-if="tool.status === 'FAILED'">✗</span>
                                    <span v-else-if="tool.status === 'CACHE_HIT'">⚡</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Separator after loading state if there are streaming components -->
                    <div
                        v-if="message.loading && hasAnyStreamingComponents(message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />
                    <!-- Error Message Section -->
                    <div
                        v-if="message.error"
                        class="px-6 py-5"
                    >
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3 flex-1">
                                <div
                                    class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    :class="themeStore.isDark ? 'bg-red-900/30' : 'bg-red-100'"
                                >
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
                                    <p
                                        class="text-base leading-relaxed"
                                        :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
                                    >
                                        {{ message.content }}
                                    </p>
                                </div>
                            </div>
                            <button
                                @click="retryQuery(message.query)"
                                class="ml-3 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                                :class="themeStore.isDark
                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700 focus:ring-slate-400'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-400'"
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

                    <!-- Streaming Text Response Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTextResponse(message)"
                            class="px-6 py-5"
                        >
                            <AIBulletin
                                :key="getTextResponseKey(message)"
                                :data="getTextResponseData(message)"
                                :animate-text="false"
                                :animate-bullets="false"
                                :show-copy-button="true"
                                :show-timestamp="false"
                            />
                        </div>
                    </Transition>

                    <!-- Subtle separator line -->
                    <div
                        v-if="hasStreamingTextResponse(message) && hasStreamingTimeline(message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />

                    <!-- Streaming Timeline Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTimeline(message)"
                            class="px-6 py-5"
                        >
                            <StatusBasedTimeline
                                :title="getTimelineData(message).title"
                                :timelineData="getTimelineData(message).data"
                            />
                        </div>
                    </Transition>

                    <!-- Separator line between timeline and table -->
                    <div
                        v-if="hasStreamingTimeline(message) && hasStreamingTable(message)"
                        class="border-t"
                        :class="themeStore.isDark ? 'border-slate-600' : 'border-gray-100'"
                    />

                    <!-- Streaming Table Section -->
                    <Transition
                        name="slide-fade"
                        appear
                    >
                        <div
                            v-if="hasStreamingTable(message)"
                            class="px-6 py-5 w-full max-w-full overflow-hidden"
                        >
                            <DataTable
                                :title="getTableData(message).title"
                                :headers="getTableData(message).headers"
                                :data="getTableData(message).data"
                                :itemsPerPage="5"
                            />
                        </div>
                    </Transition>
                </div>

                <div class="mt-1">
                    <span
                        class="text-xs"
                        :class="themeStore.isDark ? 'text-slate-400' : 'text-gray-400'"
                    >
                        {{ formatTime(message.timestamp) }}
                    </span>
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
import { useThemeStore } from '../stores/theme.js'

defineProps({
    message: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['retry-query'])
const themeStore = useThemeStore()

const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const retryQuery = (query) => {
    emit('retry-query', query)
}

// Streaming helper functions
const getLoadingText = (message) => {
    if (message.streaming) {
        if (message.toolCalls?.some(tool => tool.status === 'running')) {
            return 'Processing tools...'
        }
        return 'Analyzing your query...'
    }
    return 'Analyzing your query...'
}

const getToolStatusClass = (status) => {
    switch (status) {
    case 'SUCCESS':
        return 'bg-green-500'
    case 'FAILED':
        return 'bg-red-500'
    case 'CACHE_HIT':
        return 'bg-blue-500'
    case 'running':
    default:
        return 'bg-yellow-500 animate-pulse'
    }
}

// Streaming component detection helpers
const hasStreamingTextResponse = (message) => {
    return message.streamingComponents?.textResponse ||
        (message.results?.data?.textResponse && getResponseType(message.results).includes('text'))
}

const hasStreamingTimeline = (message) => {
    const timelineData = message.streamingComponents?.timeline || message.results?.data?.timelines
    return timelineData && timelineData.data && timelineData.data.length > 0
}

const hasStreamingTable = (message) => {
    const tableData = message.streamingComponents?.table || message.results?.data?.table
    return tableData && tableData.data && tableData.data.length > 0
}

const hasAnyStreamingComponents = (message) => {
    return hasStreamingTextResponse(message) ||
        hasStreamingTimeline(message) ||
        hasStreamingTable(message)
}

// Streaming data getters
const getTextResponseData = (message) => {
    return message.streamingComponents?.textResponse || message.results?.data?.textResponse
}

const getTextResponseKey = (message) => {
    const data = getTextResponseData(message)
    return data?.summary || message.id
}

const getTimelineData = (message) => {
    return message.streamingComponents?.timeline || message.results?.data?.timelines || { title: '', data: [] }
}

const getTableData = (message) => {
    return message.streamingComponents?.table || message.results?.data?.table || { title: '', headers: [], data: [] }
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

/* Slide-fade animation for streaming components */
.slide-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style>
