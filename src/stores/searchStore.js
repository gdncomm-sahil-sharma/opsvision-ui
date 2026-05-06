import { defineStore } from 'pinia'
import { chatApi } from '../api.js'

export const useSearchStore = defineStore('search', {
    state: () => ({
        inputMessage: '',
        messages: [],
        loading: false,
        error: null,
        results: null
    }),

    getters: {
        lastQuery: (state) => {
            const userMessages = state.messages.filter(m => m.type === 'user')
            return userMessages.length > 0 ? userMessages[userMessages.length - 1].content : ''
        },
        resultsJson: (state) => {
            return state.results ? JSON.stringify(state.results, null, 2) : null
        },
        getMessageResults: (state) => (messageId) => {
            const message = state.messages.find(m => m.id === messageId)
            return message?.results || null
        }
    },

    actions: {
        setInputMessage (message) {
            this.inputMessage = message
        },
        clearInputMessage () {
            this.inputMessage = ''
        },
        addMessage (message) {
            this.messages.push(message)
        },
        removeLoadingMessages () {
            this.messages = this.messages.filter(m => !m.loading)
        },
        clearMessages () {
            this.messages = []
        },
        async search (query) {
            this.loading = true
            this.error = null
            this.results = null  // 🔥 Clear previous results first

            try {
                const response = await chatApi(query)
                this.results = response
            } catch (error) {
                this.error = error.message || 'Search failed'
                this.results = null
                // Re-throw the error so it can be caught by the calling component
                throw error
            } finally {
                this.loading = false
            }
        },
        clear () {
            this.inputMessage = ''
            this.messages = []
            this.loading = false
            this.error = null
            this.results = null
        }
    }
})
