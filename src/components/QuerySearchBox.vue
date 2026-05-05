<template>
    <div class="max-w-4xl mx-auto px-6">
        <div class="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <!-- Search Input Section -->
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
                        class="w-full pl-14 pr-32 py-5 text-lg text-gray-700 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 shadow-sm"
                        @keyup.enter="handleSearch"
                        @input="handleInput"
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
</template>

<script setup>
import { ref, defineEmits } from 'vue'

// Props
defineProps({
    placeholder: {
        type: String,
        default: 'e.g., What orders breached SLA today? Or: Why did picking KPI drop?'
    }
})

// Emits
const emit = defineEmits(['search', 'input'])

// Reactive data
const query = ref('')

// Methods
const handleSearch = () => {
    if (query.value.trim()) {
        emit('search', query.value.trim())
    }
}

const handleInput = () => {
    emit('input', query.value)
}
</script>

<style scoped>
/* Custom styles for enhanced appearance */
.search-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Add subtle animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
