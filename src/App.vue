<script setup>
import { ref, provide } from 'vue'
import Sidebar from './components/Sidebar.vue'

const isCollapsed = ref(false)

// Provide the collapsed state to child components
provide('sidebarCollapsed', isCollapsed)

const handleSidebarToggle = (collapsed) => {
    isCollapsed.value = collapsed
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Sidebar -->
        <Sidebar @toggle="handleSidebarToggle" />

        <!-- Main Content Area with dynamic left margin -->
        <div
            :class="[
                'transition-all duration-300 ease-in-out min-h-screen',
                isCollapsed ? 'ml-16' : 'ml-64'
            ]"
        >
            <router-view />
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
