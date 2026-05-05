<!-- Results Component - Simplified placeholder for demo purposes -->
<template>
    <div class="max-w-6xl mx-auto px-6 py-8">
        <div
            v-if="isVisible"
            class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
            <!-- Loading State -->
            <div
                v-if="loading"
                class="px-8 py-12"
            >
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

            <!-- Results Content -->
            <div
                v-else-if="hasResults"
                class="px-8 py-6"
            >
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">
                            Results
                        </h3>
                        <p class="text-gray-600 text-sm mt-1">
                            {{ lastQuery }}
                        </p>
                    </div>
                    <button
                        @click="clearResults"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                    >
                        Clear Results
                    </button>
                </div>

                <!-- Order Status Card (Placeholder Data) -->
                <div class="max-w-md">
                    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-semibold text-green-800">
                                Order Status
                            </h4>
                            <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg
                                    class="w-4 h-4 text-white"
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
                        <div class="space-y-2">
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
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
    query: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    results: {
        type: Object,
        default: null
    }
})

// Emits
const emit = defineEmits(['clear'])

// Reactive data
const lastQuery = ref('')

// Computed
const isVisible = computed(() => props.query || props.loading || hasResults.value)
const hasResults = computed(() => props.results !== null || lastQuery.value)

// Methods
const clearResults = () => {
    lastQuery.value = ''
    emit('clear')
}

// Watch for new queries
const handleNewQuery = (query) => {
    if (query) {
        lastQuery.value = query
    }
}

// Expose method to parent
defineExpose({
    handleNewQuery
})
</script>
