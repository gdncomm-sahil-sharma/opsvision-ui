<script setup>
import ChatContainer from './components/ChatContainer.vue'
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 shadow-sm">
            <div class="px-6 py-3">
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
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

        <!-- Chat Container -->
        <div class="flex-1 flex flex-col min-h-0">
            <ChatContainer />
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
