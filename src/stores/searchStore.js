import { defineStore } from 'pinia'
import { streamChat } from '../api.js'

export const useSearchStore = defineStore('search', {
    state: () => ({
        inputMessage: '',
        messages: [],
        loading: false,
        error: null,
        results: null,
        currentChatId: null,
        currentStreamingMessageId: null
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
        },
        getCurrentStreamingMessage: (state) => {
            return state.messages.find(m => m.id === state.currentStreamingMessageId)
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
        updateMessage (messageId, updates) {
            const messageIndex = this.messages.findIndex(m => m.id === messageId)
            if (messageIndex !== -1) {
                this.messages[messageIndex] = { ...this.messages[messageIndex], ...updates }
            }
        },
        removeLoadingMessages () {
            this.messages = this.messages.filter(m => !m.loading)
        },
        clearMessages () {
            this.messages = []
        },
        setChatId (chatId) {
            this.currentChatId = chatId
        },
        setCurrentStreamingMessageId (messageId) {
            this.currentStreamingMessageId = messageId
        },
        async streamSearch (query) {
            this.loading = true
            this.error = null

            // Add user message
            const userMessage = {
                id: Date.now(),
                type: 'user',
                content: query,
                timestamp: new Date().toISOString()
            }
            this.addMessage(userMessage)

            // Create streaming assistant message
            const assistantMessageId = Date.now() + 1
            const assistantMessage = {
                id: assistantMessageId,
                type: 'assistant',
                loading: true,
                streaming: true,
                query: query, // Store the original query for retry functionality
                toolCalls: [],
                streamingComponents: {
                    textResponse: null,
                    timeline: null,
                    table: null,
                    references: null
                },
                finalData: null,
                timestamp: new Date().toISOString()
            }
            this.addMessage(assistantMessage)
            this.setCurrentStreamingMessageId(assistantMessageId)

            const handlers = {
                chat_id: (event) => {
                    this.setChatId(event.chatId)
                },

                tool_call_start: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            toolCalls: [...message.toolCalls, {
                                toolName: event.toolName,
                                input: event.input,
                                status: 'running',
                                startTime: Date.now()
                            }]
                        })
                    }
                },

                tool_call_end: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        const updatedToolCalls = message.toolCalls.map(tool =>
                            tool.toolName === event.toolName && tool.status === 'running'
                                ? { ...tool, status: event.status, latencyMs: event.latencyMs, errorMessage: event.errorMessage }
                                : tool
                        )
                        this.updateMessage(message.id, { toolCalls: updatedToolCalls })
                    }
                },

                assistant_token: (event) => {
                    // We can ignore these for now as we handle complete events
                },

                text_response_complete: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            streamingComponents: {
                                ...message.streamingComponents,
                                textResponse: event.textResponse
                            }
                        })
                    }
                },

                timeline_complete: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            streamingComponents: {
                                ...message.streamingComponents,
                                timeline: event.timeline
                            }
                        })
                    }
                },

                table_complete: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            streamingComponents: {
                                ...message.streamingComponents,
                                table: event.table
                            }
                        })
                    }
                },

                references_complete: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            streamingComponents: {
                                ...message.streamingComponents,
                                references: event.references
                            }
                        })
                    }
                },

                final: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            loading: false,
                            streaming: false,
                            finalData: event.data,
                            results: event.data,
                            content: event.data?.textResponse?.summary || 'Response completed'
                        })
                    }
                    this.setCurrentStreamingMessageId(null)
                    this.loading = false
                },

                error: (event) => {
                    const message = this.getCurrentStreamingMessage
                    if (message) {
                        this.updateMessage(message.id, {
                            loading: false,
                            streaming: false,
                            error: event.errorMessage,
                            content: 'I\'m sorry, I\'m currently unable to process your request. The service appears to be temporarily unavailable. Please try again later.'
                        })
                    }
                    this.setCurrentStreamingMessageId(null)
                    this.loading = false
                    this.error = event.errorMessage
                }
            }

            try {
                await streamChat('demo-user', this.currentChatId, query, handlers)
            } catch (error) {
                // Handle any network-level errors
                const message = this.getCurrentStreamingMessage
                if (message) {
                    this.updateMessage(message.id, {
                        loading: false,
                        streaming: false,
                        error: error.message,
                        content: 'I\'m sorry, I\'m currently unable to process your request. The service appears to be temporarily unavailable. Please try again later.'
                    })
                }
                this.setCurrentStreamingMessageId(null)
                this.loading = false
                this.error = error.message
                throw error
            }
        },
        clear () {
            this.inputMessage = ''
            this.messages = []
            this.loading = false
            this.error = null
            this.results = null
            this.currentChatId = null
            this.currentStreamingMessageId = null
        }
    }
})
