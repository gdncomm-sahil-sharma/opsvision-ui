import { ref } from 'vue'

const isDark = ref(false)

export const useThemeStore = () => {
    const toggleDarkMode = () => {
        isDark.value = !isDark.value
    }

    return {
        isDark,
        toggleDarkMode
    }
}
