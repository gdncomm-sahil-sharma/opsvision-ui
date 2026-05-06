import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    // Load initial state from localStorage, default to false if not found
    const getInitialDarkMode = () => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return false
        }
        try {
            const stored = window.localStorage.getItem('theme-isDark')
            return stored !== null ? JSON.parse(stored) : false
        } catch (error) {
            console.warn('Failed to parse theme from localStorage:', error)
            return false
        }
    }

    const isDark = ref(getInitialDarkMode())

    // Watch for changes and save to localStorage
    watch(isDark, (newValue) => {
        if (typeof window === 'undefined' || !window.localStorage) {
            return
        }
        try {
            window.localStorage.setItem('theme-isDark', JSON.stringify(newValue))
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error)
        }
    }, { immediate: false })

    const toggleDarkMode = () => {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleDarkMode
    }
})
