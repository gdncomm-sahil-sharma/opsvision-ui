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
            <div class="max-w-4xl">
                <!-- Assistant Avatar -->
                <div class="flex items-start space-x-3 mb-2">
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
                    <div class="text-sm font-semibold text-gray-800">
                        OPSVISION
                    </div>
                </div>

                <!-- Loading State -->
                <div
                    v-if="message.loading"
                    class="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-6 py-4"
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
                    class="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-6 py-5"
                >
                    <!-- Response Text -->
                    <div
                        v-if="message.content"
                        class="mb-4"
                    >
                        <p class="text-gray-900 text-base leading-relaxed mb-4">
                            {{ message.content }}
                        </p>
                    </div>

                    <!-- Results Cards -->
                    <div
                        v-if="message.results"
                        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <!-- Performance Metrics Card -->
                        <div
                            v-if="message.results.performance"
                            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
                        >
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-blue-800 text-sm">
                                    Performance Metrics
                                </h4>
                                <div class="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <svg
                                        class="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Picking Rate</span>
                                    <span class="font-semibold text-blue-700">127 items/hr</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Accuracy</span>
                                    <span class="font-semibold text-green-600">99.2%</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Efficiency</span>
                                    <span class="font-semibold text-blue-700">94.7%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Order Status Card -->
                        <div
                            v-if="message.results.orders"
                            class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
                        >
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-green-800 text-sm">
                                    Order Status
                                </h4>
                                <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg
                                        class="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Completed</span>
                                    <span class="font-semibold text-green-700">1,247</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">In Progress</span>
                                    <span class="font-semibold text-yellow-600">83</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Pending</span>
                                    <span class="font-semibold text-gray-600">24</span>
                                </div>
                            </div>
                        </div>

                        <!-- Alerts Card -->
                        <div
                            v-if="message.results.alerts"
                            class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
                        >
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-orange-800 text-sm">
                                    Alerts & Issues
                                </h4>
                                <div class="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <svg
                                        class="w-3 h-3 text-white"
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
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">SLA Breaches</span>
                                    <span class="font-semibold text-red-600">3</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Low Inventory</span>
                                    <span class="font-semibold text-orange-600">12</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Delays</span>
                                    <span class="font-semibold text-yellow-600">7</span>
                                </div>
                            </div>
                        </div>

                        <!-- Inventory Card -->
                        <div
                            v-if="message.results.inventory"
                            class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
                        >
                            <div class="flex items-center justify-between mb-3">
                                <h4 class="font-semibold text-purple-800 text-sm">
                                    Inventory Status
                                </h4>
                                <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <svg
                                        class="w-3 h-3 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Total Items</span>
                                    <span class="font-semibold text-purple-700">45,892</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Available</span>
                                    <span class="font-semibold text-green-600">42,156</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Reserved</span>
                                    <span class="font-semibold text-blue-600">3,736</span>
                                </div>
                            </div>
                        </div>
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

const props = defineProps({
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
