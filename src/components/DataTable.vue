<template>
    <div class="w-full max-w-full bg-white overflow-hidden">
        <!-- Title and Search -->
        <div class="pb-4 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
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
                    class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 bg-gray-50 transition-all duration-200"
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
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                        class="pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 w-64 bg-gray-50 transition-all duration-200"
                    />

                    <!-- Clear button -->
                    <button
                        v-if="searchQuery"
                        @click="clearSearch"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            <div class="overflow-x-auto overflow-y-hidden border border-gray-200 rounded-lg w-full">
                <table
                    class="table-auto w-full"
                    style="min-width: max-content;"
                >
                    <!-- Headers -->
                    <thead class="bg-gray-50/70">
                        <tr>
                            <th
                                v-for="(header, index) in headers"
                                :key="index"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap"
                            >
                                {{ header }}
                            </th>
                        </tr>
                    </thead>

                    <!-- Body -->
                    <tbody class="bg-white divide-y divide-gray-100 border-t border-gray-100">
                        <tr
                            v-for="(row, rowIndex) in paginatedData"
                            :key="rowIndex"
                            class="hover:bg-gray-50/50"
                        >
                            <td
                                v-for="(cell, cellIndex) in row"
                                :key="cellIndex"
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
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
            <div class="text-sm text-gray-700">
                Showing {{ startRecord }} to {{ endRecord }} of {{ totalRecords }} events
                <span
                    v-if="searchQuery"
                    class="text-gray-500"
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
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            ? 'bg-gray-700 text-white border-gray-700'
                            : 'border-gray-300 hover:bg-gray-50'
                    ]"
                >
                    {{ page }}
                </button>

                <!-- Next button -->
                <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    console.log('DataTable pagination:', { itemsPerPage: props.itemsPerPage, itemsPerPageNum, start, end, totalData: filteredData.value.length })
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
/* Custom scrollbar styles */
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
</style>
