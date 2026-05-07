import { defineStore } from 'pinia'
import { streamChat, submitFeedback, getChatHistory, getChatMessages } from '../api.js'

export const useSearchStore = defineStore('search', {
    state: () => ({
        inputMessage: '',
        messages: [],
        loading: false,
        error: null,
        results: null,
        currentChatId: null,
        currentStreamingMessageId: null,
        chatHistory: [],
        loadingHistory: false,
        historyError: null
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
                    const previousChatId = this.currentChatId
                    this.setChatId(event.chatId)

                    // Only refresh chat history if this is a new chat (not continuing existing one)
                    if (!previousChatId || previousChatId !== event.chatId) {
                        this.fetchChatHistory().catch(error => {
                            console.error('Failed to refresh chat history:', error)
                        })
                    }
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

                assistant_token: () => {
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
        },

        clearHistory () {
            this.chatHistory = []
            this.loadingHistory = false
            this.historyError = null
        },

        async submitMessageFeedback (messageId, feedbackData) {
            try {
                // Find the message and its sequence
                const message = this.messages.find(m => m.id === messageId)
                if (!message) {
                    throw new Error('Message not found')
                }

                // For now, use a demo user ID and calculate sequence based on position
                const userId = 'demo-user'
                const assistantMessages = this.messages.filter(m => m.type === 'assistant')
                const messageIndex = assistantMessages.findIndex(m => m.id === messageId)
                const sequence = messageIndex + 1 // 1-based sequence

                if (!this.currentChatId) {
                    throw new Error('No active chat session')
                }

                // Submit feedback to API (or reset if helpful is null)
                let response
                if (feedbackData.helpful === null) {
                    // Reset feedback - for now just update locally
                    response = { helpful: null, feedbackComment: null }
                } else {
                    response = await submitFeedback(
                        userId,
                        this.currentChatId,
                        sequence,
                        feedbackData.helpful,
                        feedbackData.comment
                    )
                }

                // Update the message with feedback information
                if (feedbackData.helpful === null) {
                    // Reset feedback
                    this.updateMessage(messageId, {
                        feedback: null
                    })
                } else {
                    this.updateMessage(messageId, {
                        feedback: {
                            helpful: feedbackData.helpful,
                            feedbackComment: feedbackData.comment,
                            submittedAt: new Date().toISOString()
                        }
                    })
                }

                return response
            } catch (error) {
                console.error('Failed to submit feedback:', error)
                throw error
            }
        },

        getMessageFeedback (messageId) {
            const message = this.messages.find(m => m.id === messageId)
            return message?.feedback || null
        },

        async fetchChatHistory (userId = 'demo-user', status = 'ACTIVE') {
            this.loadingHistory = true
            this.historyError = null

            try {
                const history = await getChatHistory(userId, status)
                this.chatHistory = history
                return history
            } catch (error) {
                console.error('Failed to fetch chat history:', error)
                this.historyError = error.message
                throw error
            } finally {
                this.loadingHistory = false
            }
        },

        async loadChatMessages (chatId, userId = 'demo-user') {
            this.loading = true
            this.error = null

            try {
                // Clear current messages
                this.clearMessages()

                // Set the chat ID
                this.setChatId(chatId)

                // Fetch messages from API
                const apiMessages = await getChatMessages(chatId, userId)

                // Convert API messages to our internal format
                apiMessages.forEach(apiMessage => {
                    // Add user message
                    const userMessage = {
                        id: `${apiMessage.sequence}-user`,
                        type: 'user',
                        content: apiMessage.query,
                        timestamp: apiMessage.createdAt
                    }
                    this.addMessage(userMessage)

                    // Add assistant message
                    const assistantMessage = {
                        id: `${apiMessage.sequence}-assistant`,
                        type: 'assistant',
                        content: apiMessage.response,
                        loading: false,
                        streaming: false,
                        query: apiMessage.query,
                        toolCalls: [],
                        streamingComponents: {
                            textResponse: { summary: apiMessage.response },
                            timeline: null,
                            table: null,
                            references: apiMessage.references || null
                        },
                        finalData: {
                            textResponse: { summary: apiMessage.response },
                            references: apiMessage.references || null
                        },
                        results: {
                            textResponse: { summary: apiMessage.response },
                            references: apiMessage.references || null
                        },
                        timestamp: apiMessage.createdAt,
                        feedback: apiMessage.helpful !== null ? {
                            helpful: apiMessage.helpful,
                            feedbackComment: apiMessage.feedbackComment
                        } : null
                    }
                    this.addMessage(assistantMessage)
                })

                return apiMessages
            } catch (error) {
                console.error('Failed to load chat messages:', error)
                this.error = error.message
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
