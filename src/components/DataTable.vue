<template>
    <div
        class="w-full max-w-full overflow-hidden"
        :class="themeStore.isDark ? 'bg-slate-800' : 'bg-white'"
    >
        <!-- Title and Search -->
        <div class="pb-4 flex justify-between items-center">
            <h3
                class="text-lg font-semibold"
                :class="themeStore.isDark ? 'text-white' : 'text-gray-900'"
            >
                {{ title }}
            </h3>

            <!-- Search Controls -->
            <div
                v-if="props.data.length > 0"
                class="flex items-center space-x-3"
            >
                <!-- Column Selector (optional) -->
                <select
                    v-if="enableColumnSearch"
                    v-model="searchColumn"
                    :class="[
                        'px-3 py-2 text-sm border rounded-md focus:outline-none transition-all duration-200',
                        themeStore.isDark
                            ? 'border-gray-600 bg-slate-700 text-white focus:border-gray-500'
                            : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-400'
                    ]"
                >
                    <option value="">
                        All Columns
                    </option>
                    <option
                        v-for="(header, index) in headers"
                        :key="index"
                        :value="index"
                    >
                        {{ header }}
                    </option>
                </select>

                <!-- Search Input -->
                <div class="relative">
                    <!-- Search icon -->
                    <svg
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                        :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-400'"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search here"
                        :class="[
                            'pl-10 pr-10 py-2 text-sm border rounded-md focus:outline-none w-64 transition-all duration-200',
                            themeStore.isDark
                                ? 'border-gray-600 bg-slate-700 text-white placeholder-gray-400 focus:border-gray-500'
                                : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-gray-400'
                        ]"
                    />

                    <!-- Clear button -->
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        :class="[
                            'absolute right-3 top-1/2 transform -translate-y-1/2',
                            themeStore.isDark
                                ? 'text-gray-400 hover:text-gray-200'
                                : 'text-gray-400 hover:text-gray-600'
                        ]"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="relative max-w-full">
            <div
                class="overflow-x-auto overflow-y-hidden border rounded-lg w-full"
                :class="themeStore.isDark ? 'border-gray-600' : 'border-gray-200'"
            >
                <table
                    class="table-auto w-full"
                    style="min-width: max-content;"
                >
                    <!-- Headers -->
                    <thead :class="themeStore.isDark ? 'bg-slate-700/70' : 'bg-gray-50/70'">
                        <tr>
                            <th
                                v-for="(header, index) in headers"
                                :key="index"
                                :class="[
                                    'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap',
                                    themeStore.isDark ? 'text-gray-300' : 'text-gray-600'
                                ]"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>

                    <!-- Body -->
                    <tbody
                        :class="[
                            'divide-y border-t',
                            themeStore.isDark
                                ? 'bg-slate-800 divide-gray-600 border-gray-600'
                                : 'bg-white divide-gray-100 border-gray-100'
                        ]"
                    >
                        <tr
                            v-for="(row, rowIndex) in paginatedData"
                            :key="rowIndex"
                            :class="themeStore.isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50/50'"
                        >
                            <td
                                v-for="(cell, cellIndex) in row"
                                :key="cellIndex"
                                :class="[
                                    'px-6 py-4 whitespace-nowrap text-sm',
                                    themeStore.isDark ? 'text-gray-200' : 'text-gray-900'
                                ]"
                            >
                                {{ formatCell(cell) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <div
            v-if="totalPages > 1"
            class="px-6 py-4 flex items-center justify-between"
        >
            <!-- Results count -->
            <div
                class="text-sm"
                :class="themeStore.isDark ? 'text-gray-300' : 'text-gray-700'"
            >
                Showing {{ startRecord }} to {{ endRecord }} of {{ totalRecords }} events
                <span
                    v-if="searchQuery"
                    :class="themeStore.isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                    (filtered from {{ props.data.length }} total)
                </span>
            </div>

            <!-- Page navigation -->
            <div class="flex items-center space-x-2">
                <!-- Previous button -->
                <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    :class="[
                        'px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed',
                        themeStore.isDark
                            ? 'border-gray-600 text-white hover:bg-slate-700'
                            : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    ]"
                >
                    ‹
                </button>

                <!-- Page numbers -->
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                        'px-3 py-1 text-sm border rounded',
                        page === currentPage
                            ? (themeStore.isDark
                                ? 'bg-slate-600 text-white border-slate-600'
                                : 'bg-gray-700 text-white border-gray-700')
                            : (themeStore.isDark
                                ? 'border-gray-600 text-gray-200 hover:bg-slate-700'
                                : 'border-gray-300 text-gray-900 hover:bg-gray-50')
                    ]"
                >
                    {{ page }}
                </button>

                <!-- Next button -->
                <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    :class="[
                        'px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed',
                        themeStore.isDark
                            ? 'border-gray-600 text-white hover:bg-slate-700'
                            : 'border-gray-300 text-gray-900 hover:bg-gray-50'
                    ]"
                >
                    ›
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import moment from 'moment'
import { useThemeStore } from '../stores/theme.js'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    headers: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        required: true,
        default: () => []
    },
    itemsPerPage: {
        type: Number,
        default: 10
    },
    enableColumnSearch: {
        type: Boolean,
        default: false
    }
})

const themeStore = useThemeStore()

// Pagination state
const currentPage = ref(1)

// Search state
const searchQuery = ref('')
const searchColumn = ref('')

// Computed properties
const filteredData = computed(() => {
    const trimmedQuery = searchQuery.value?.trim()
    if (!trimmedQuery) return props.data

    const query = trimmedQuery.toLowerCase()

    return props.data.filter(row => {
        // If specific column is selected for search
        if (searchColumn.value !== '') {
            const cellValue = formatCell(row[Number(searchColumn.value)])
            return String(cellValue).toLowerCase().includes(query)
        }

        // Search all columns
        return row.some(cell => {
            const cellValue = formatCell(cell) // formatCell for consistent formatting
            return String(cellValue).toLowerCase().includes(query)
        })
    })
})

const totalRecords = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / Number(props.itemsPerPage)))

const paginatedData = computed(() => {
    const itemsPerPageNum = Number(props.itemsPerPage)
    const start = (currentPage.value - 1) * itemsPerPageNum
    const end = start + itemsPerPageNum
    return filteredData.value.slice(start, end)
})

const startRecord = computed(() => {
    if (totalRecords.value === 0) return 0
    return (currentPage.value - 1) * Number(props.itemsPerPage) + 1
})

const endRecord = computed(() => {
    const end = currentPage.value * Number(props.itemsPerPage)
    return Math.min(end, totalRecords.value)
})

const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5
    const half = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage.value - half)
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Methods
const formatCell = (cell) => {
    // Check if this might be a timestamp (assuming timestamp is in certain columns or is a large number)
    if (typeof cell === 'number' && cell > 1000000000000) {
        return moment(cell).format('MMM D, YYYY h:mm A')
    }

    return cell
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const clearSearch = () => {
    searchQuery.value = ''
    searchColumn.value = ''
    currentPage.value = 1
}

// Reset to first page when search query changes
watch(searchQuery, () => {
    currentPage.value = 1
})
</script>

<style scoped>
/* Custom scrollbar styles - Light mode */
.overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db #f3f4f6;
}

.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Custom scrollbar styles - Dark mode */
:deep(.dark) .overflow-x-auto {
    scrollbar-color: #6b7280 #374151;
}

:deep(.dark) .overflow-x-auto::-webkit-scrollbar-track {
    background: #374151;
}

:deep(.dark) .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #6b7280;
}

:deep(.dark) .overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>
