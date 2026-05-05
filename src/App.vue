<script setup>
import { ref } from 'vue'

// Reactive data
const query = ref('')
const isLoading = ref(false)
const showResults = ref(false)

// Methods
const handleSearch = () => {
    if (query.value.trim()) {
        isLoading.value = true
        showResults.value = true

        // Simulate API call
        window.setTimeout(() => {
            isLoading.value = false
        }, 1500)
    }
}

const clearResults = () => {
    query.value = ''
    showResults.value = false
    isLoading.value = false
}
</script>

<template>
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <header class="fixed top-0 left-0 right-0 z-50 bg-gray-100 bg-opacity-95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div class="px-6 py-2">
                <div class="flex items-center space-x-1">
                    <div class="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                        <!-- Simple Package/Box Icon -->
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
                    <h1 class="text-xl font-semibold text-gray-900">
                        OPSVISION
                    </h1>
                </div>
            </div>
        </header>

        <!-- Hero Section with Search -->
        <div class="bg-white pt-12">
            <!-- Main Hero Content -->
            <div class="pt-16 pb-20">
                <div class="w-full text-center">
                    <!-- Hero Title -->
                    <div class="mb-12 max-w-6xl mx-auto px-6">
                        <h1 class="text-5xl md:text-6xl font-medium text-gray-900 mb-4 leading-tight text-center">
                            Operational Intelligence
                        </h1>
                        <p class="text-lg text-gray-600 leading-relaxed font-normal text-center">
                            Ask anything about your warehouse operations and get instant insights
                        </p>
                    </div>

                    <!-- Search Box -->
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                            <div class="px-8 py-8">
                                <div class="relative flex items-center">
                                    <!-- Location Icon -->
                                    <div class="absolute left-5 z-10">
                                        <svg
                                            class="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>

                                    <!-- Input Field -->
                                    <input
                                        v-model="query"
                                        type="text"
                                        placeholder="Enter your warehouse query to see insights..."
                                        class="w-full pl-14 pr-32 py-5 text-lg font-normal text-gray-700 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm"
                                        @keyup.enter="handleSearch"
                                    />

                                    <!-- Search Button -->
                                    <button
                                        @click="handleSearch"
                                        :disabled="!query.trim()"
                                        class="absolute right-3 px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Results Section -->
        <div class="bg-white min-h-screen">
            <!-- Loading State -->
            <div
                v-if="isLoading"
                class="max-w-6xl mx-auto px-6 py-8"
            >
                <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div class="px-8 py-12">
                        <div class="flex flex-col items-center justify-center space-y-4">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                            <p class="text-gray-600 text-lg">
                                Analyzing your query...
                            </p>
                            <p class="text-gray-400 text-sm">
                                Processing warehouse data and generating insights
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Content -->
            <div
                v-else-if="showResults"
                class="max-w-6xl mx-auto px-6 py-8"
            >
                <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div class="px-8 py-6">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800">
                                    Query Results
                                </h3>
                                <p class="text-gray-600 text-sm mt-1">
                                    {{ query }}
                                </p>
                            </div>
                            <button
                                @click="clearResults"
                                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                            >
                                Clear Results
                            </button>
                        </div>

                        <!-- Sample Result Cards -->
                        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <h4 class="font-semibold text-blue-800 mb-3">
                                    Performance Metrics
                                </h4>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Picking Rate</span>
                                        <span class="font-semibold text-blue-700">127 items/hr</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Accuracy</span>
                                        <span class="font-semibold text-green-600">99.2%</span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                                <h4 class="font-semibold text-green-800 mb-3">
                                    Order Status
                                </h4>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Completed</span>
                                        <span class="font-semibold text-green-700">1,247</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">In Progress</span>
                                        <span class="font-semibold text-yellow-600">83</span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                                <h4 class="font-semibold text-orange-800 mb-3">
                                    Alerts
                                </h4>
                                <div class="space-y-2">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">SLA Breaches</span>
                                        <span class="font-semibold text-red-600">3</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Low Inventory</span>
                                        <span class="font-semibold text-orange-600">12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section (when no query) -->
            <div
                v-if="!showResults"
                class="max-w-6xl mx-auto px-6 pb-16"
            >
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                    <!-- Feature 1 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg
                                class="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            Real-time Analytics
                        </h3>
                        <p class="text-gray-600 text-sm">
                            Monitor warehouse operations with live data insights
                        </p>
                    </div>

                    <!-- Feature 2 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg
                                class="w-8 h-8 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            Smart Insights
                        </h3>
                        <p class="text-gray-600 text-sm">
                            AI-powered analysis of operational patterns
                        </p>
                    </div>

                    <!-- Feature 3 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg
                                class="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            Fast Processing
                        </h3>
                        <p class="text-gray-600 text-sm">
                            Get instant results from complex queries
                        </p>
                    </div>

                    <!-- Feature 4 -->
                    <div class="text-center">
                        <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg
                                class="w-8 h-8 text-orange-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            Live Tracking
                        </h3>
                        <p class="text-gray-600 text-sm">
                            Track operations and KPIs in real time
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-gradient-pattern {
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        rgba(255, 255, 255, 0.05) 35px,
        rgba(255, 255, 255, 0.05) 70px
    ),
    repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 35px,
        rgba(255, 255, 255, 0.05) 35px,
        rgba(255, 255, 255, 0.05) 70px
    );
}
</style>
