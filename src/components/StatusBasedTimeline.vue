<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
    timelineData: {
        type: Array,
        required: true,
        default: () => []
    },
    title: {
        type: String,
        required: true,
        default: 'Order Timeline'
    }
})

const themeStore = useThemeStore()
const { isDark } = themeStore

const formatDate = (epochTimestamp) => {
    return moment(epochTimestamp).format('MMM D, YYYY')
}

const processedItems = computed(() => {
    return props.timelineData.map((item, index) => {
        let statusColors

        switch (item.status) {
        case 'COMPLETED':
            statusColors = {
                indicator: 'bg-green-500 text-white'
            }
            break
        case 'PENDING':
            statusColors = {
                indicator: 'bg-blue-500 text-white'
            }
            break
        case 'FAILED':
            statusColors = {
                indicator: 'bg-red-500 text-white'
            }
            break
        case 'NOT_STARTED':
            statusColors = {
                indicator: 'bg-gray-400 text-white'
            }
            break
        case 'CANCELLED':
            statusColors = {
                indicator: 'bg-gray-400 text-white'
            }
            break
        default:
            statusColors = {
                indicator: 'bg-gray-400 text-white'
            }
        }

        return {
            ...item,
            date: formatDate(item.date),
            value: index,
            ui: {
                ...statusColors,
                wrapper: isDark.value ? 'text-white' : '',
                title: isDark.value ? 'text-white font-semibold' : 'font-semibold',
                description: isDark.value ? 'text-zinc-400' : 'text-gray-600',
                date: isDark.value ? 'text-zinc-400' : 'text-gray-500'
            }
        }
    })
})

const getTimelineClasses = () => {
    return props.timelineData.map((item, index) => `item-${index}-${item.status}`).join(' ')
}

const getItemNumber = (item) => {
    const index = processedItems.value.findIndex(p => p.value === item.value)
    return index + 1
}

const getNumberIndicatorClass = (item) => {
    const originalItem = props.timelineData.find(t => t.title === item.title)
    switch (originalItem?.status) {
    case 'COMPLETED':
        return 'bg-green-500'
    case 'PENDING':
        return 'bg-blue-500'
    case 'FAILED':
        return 'bg-red-500'
    case 'NOT_STARTED':
        return 'bg-gray-400'
    default:
        return 'bg-gray-400'
    }
}

const getStatusBadgeClass = (status) => {
    switch (status) {
    case 'COMPLETED':
        return isDark.value ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-800'
    case 'PENDING':
        return isDark.value ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
    case 'FAILED':
        return isDark.value ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-800'
    case 'NOT_STARTED':
        return isDark.value ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
        return isDark.value ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
    default:
        return isDark.value ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
    }
}
</script>

<template>
    <div
        class="w-full px-6 pt-6 pb-0 rounded-lg transition-colors duration-300"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
        style="min-width: 700px; max-width: 90vw; margin: 0 auto;"
    >
        <div class="mb-6">
            <h3
                class="text-xl font-bold text-left"
                :class="isDark ? 'text-white' : 'text-gray-900'"
            >
                {{ title }}
            </h3>
        </div>

        <div
            class="timeline-wrapper left-align-wrapper"
            :class="[getTimelineClasses(), { 'dark-timeline': isDark }]"
            :style="isDark ? 'color: #ffffff !important;' : ''"
        >
            <UTimeline
                :items="processedItems"
                :default-value="1"
                class="status-timeline compact-timeline"
                :style="isDark ? 'color: #ffffff !important;' : ''"
            >
                <template #indicator="{ item }">
                    <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm indicator-circle"
                        :class="getNumberIndicatorClass(item)"
                    >
                        <span v-if="item.status === 'COMPLETED'">✓</span>
                        <span v-else-if="item.status === 'FAILED'">✗</span>
                        <span v-else>{{ getItemNumber(item) }}</span>
                    </div>
                </template>
            </UTimeline>

            <!-- Status Badges Overlay -->
            <div class="status-badges-container">
                <div
                    v-for="(item, index) in processedItems"
                    :key="`status-${index}`"
                    class="status-badge-wrapper"
                >
                    <span
                        class="inline-flex items-center px-4 py-2 rounded-md text-xs transition-colors duration-200 status-badge font-bold"
                        :class="getStatusBadgeClass(item.status)"
                    >
                        {{ item.status.replace('_', ' ') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.dark {
  background-color: #1f2937;
}

.compact-timeline :deep(.group) {
  gap: 0.5rem !important;
}

.compact-timeline :deep(.container) {
  gap: 0.5rem !important;
}

.compact-timeline :deep(.group) {
  text-align: left !important;
}

.compact-timeline :deep(.group .wrapper) {
  text-align: left !important;
}

.compact-timeline :deep(.group .wrapper *) {
  text-align: left !important;
}

.compact-timeline :deep(.group [class*="font-medium"]),
.compact-timeline :deep(.group [class*="text-"]) {
  text-align: left !important;
}

.left-align-wrapper {
  text-align: left !important;
}

.left-align-wrapper * {
  text-align: left !important;
}

.left-align-wrapper :deep(*) {
  text-align: left !important;
}

.dark-timeline :deep(.font-medium) {
  color: #f9fafb !important;
}

.dark-timeline :deep(.text-muted) {
  color: #a4a4a7 !important;
}

.dark-timeline :deep(.text-dimmed) {
  color: #a4a4a7 !important;
}

.dark-timeline :deep(.text-highlighted) {
  color: #ffffff !important;
}

.dark-timeline :deep(.bg-elevated) {
  background-color: #374151 !important;
}

.dark-timeline :deep(.group .wrapper) {
  color: #e5e7eb !important;
}

.dark-timeline :deep(.group .wrapper *) {
  color: var(--description-color) !important;
}

.dark-timeline :deep([class*="text-"]) {
  color: var(--description-color) !important;
}

.dark-timeline :deep(.group .font-medium) {
  color: var(--title-color) !important;
}

.dark-timeline :deep(.group .text-xs) {
  color: var(--date-color) !important;
}

.dark {
  --text-color: #ffffff;
  --title-color: #ffffff;
  --description-color: #a4a4a7;
  --date-color: #a4a4a7;
}

.dark-timeline :deep(.group),
.dark-timeline :deep(.group div),
.dark-timeline :deep(.group span),
.dark-timeline :deep(.group p) {
  color: var(--text-color) !important;
}

.dark-timeline :deep(.group .text-sm) {
  color: var(--title-color) !important;
}

.dark-timeline :deep(.group .text-wrap) {
  color: var(--description-color) !important;
}

.dark-timeline :deep(.group .wrapper .font-medium) {
  color: var(--title-color) !important;
}

.dark-timeline :deep(.group .wrapper .text-sm:not(.font-medium)) {
  color: var(--description-color) !important;
}

.dark-timeline :deep(.group .wrapper .text-xs) {
  color: var(--date-color) !important;
}

/* COMPLETED indicators - highest priority */
.timeline-wrapper.item-0-COMPLETED .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-COMPLETED .status-timeline .group:nth-child(1) [class*="bg-"]:not([class*="timeline"]):not([class*="connector"]),
.timeline-wrapper.item-0-COMPLETED .status-timeline .group:nth-child(1) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-1-COMPLETED .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-COMPLETED .status-timeline .group:nth-child(2) [class*="bg-"],
.timeline-wrapper.item-1-COMPLETED .status-timeline .group:nth-child(2) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-2-COMPLETED .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-COMPLETED .status-timeline .group:nth-child(3) [class*="bg-"],
.timeline-wrapper.item-2-COMPLETED .status-timeline .group:nth-child(3) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-3-COMPLETED .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-COMPLETED .status-timeline .group:nth-child(4) [class*="bg-"],
.timeline-wrapper.item-3-COMPLETED .status-timeline .group:nth-child(4) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-0-PENDING .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-PENDING .status-timeline .group:nth-child(1) [class*="bg-"],
.timeline-wrapper.item-0-PENDING .status-timeline .group:nth-child(1) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-1-PENDING .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-PENDING .status-timeline .group:nth-child(2) [class*="bg-"],
.timeline-wrapper.item-1-PENDING .status-timeline .group:nth-child(2) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-2-PENDING .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-PENDING .status-timeline .group:nth-child(3) [class*="bg-"],
.timeline-wrapper.item-2-PENDING .status-timeline .group:nth-child(3) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-3-PENDING .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-PENDING .status-timeline .group:nth-child(4) [class*="bg-"],
.timeline-wrapper.item-3-PENDING .status-timeline .group:nth-child(4) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-0-FAILED .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-FAILED .status-timeline .group:nth-child(1) [class*="bg-"],
.timeline-wrapper.item-0-FAILED .status-timeline .group:nth-child(1) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-1-FAILED .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-FAILED .status-timeline .group:nth-child(2) [class*="bg-"],
.timeline-wrapper.item-1-FAILED .status-timeline .group:nth-child(2) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-2-FAILED .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-FAILED .status-timeline .group:nth-child(3) [class*="bg-"],
.timeline-wrapper.item-2-FAILED .status-timeline .group:nth-child(3) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-3-FAILED .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-FAILED .status-timeline .group:nth-child(4) [class*="bg-"],
.timeline-wrapper.item-3-FAILED .status-timeline .group:nth-child(4) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-0-NOT_STARTED .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-NOT_STARTED .status-timeline .group:nth-child(1) [class*="bg-"] {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-1-NOT_STARTED .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-NOT_STARTED .status-timeline .group:nth-child(2) [class*="bg-"] {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-2-NOT_STARTED .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-NOT_STARTED .status-timeline .group:nth-child(3) [class*="bg-"] {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-3-NOT_STARTED .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-NOT_STARTED .status-timeline .group:nth-child(4) [class*="bg-"] {
  background-color: #9ca3af !important;
  color: white !important;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

.timeline-wrapper.item-0-PENDING .status-timeline .group:nth-child(1) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-1-PENDING .status-timeline .group:nth-child(2) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-2-PENDING .status-timeline .group:nth-child(3) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-3-PENDING .status-timeline .group:nth-child(4) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

/* Add CSS for items 4 and 5 - COMPLETED */
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

/* Add CSS for items 4 and 5 - PENDING */
.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

/* Add CSS for items 4 and 5 - FAILED */
.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

/* Add CSS for items 4 and 5 - NOT_STARTED */
.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) .indicator-circle {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) .indicator-circle {
  background-color: #9ca3af !important;
  color: white !important;
}

/* Add CSS for items 4 and 5 - CANCELLED */
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) .indicator-circle {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) .indicator-circle {
  background-color: #9ca3af !important;
  color: white !important;
}

/* Make all connecting lines grey */
.status-timeline :deep(.border-primary) {
  border-color: #9ca3af !important;
}

.status-timeline :deep([class*="border-"]) {
  border-color: #9ca3af !important;
}

.status-timeline :deep(.bg-primary) {
  background-color: #9ca3af !important;
}

.status-timeline :deep([class*="bg-primary"]) {
  background-color: #9ca3af !important;
}

/* Override UTimeline default line colors - comprehensive approach */
.status-timeline :deep(.divide-y > *::before),
.status-timeline :deep(.divide-y > *::after) {
  border-color: #9ca3af !important;
}

.status-timeline :deep(.group::before),
.status-timeline :deep(.group::after) {
  border-color: #9ca3af !important;
  background-color: #9ca3af !important;
}

/* Target all possible timeline line elements */
.status-timeline :deep(.border-l),
.status-timeline :deep(.border-l-2),
.status-timeline :deep(.border-l-4) {
  border-left-color: #9ca3af !important;
}

.status-timeline :deep(.bg-blue-500),
.status-timeline :deep(.bg-blue-600),
.status-timeline :deep(.bg-primary-500) {
  background-color: #9ca3af !important;
}

/* Force override any timeline connector */
.status-timeline :deep([class*="timeline"]) [class*="border"] {
  border-color: #9ca3af !important;
}

.status-timeline :deep([class*="timeline"]) [class*="bg-"] {
  background-color: #9ca3af !important;
}

/* Specific UTimeline line overrides */
.status-timeline :deep(.ui-timeline-item::before) {
  background-color: #9ca3af !important;
}

.status-timeline :deep(.ui-timeline-connector) {
  background-color: #9ca3af !important;
  border-color: #9ca3af !important;
}

/* Nuclear option - force ALL background colors except indicators to grey */
.status-timeline :deep(*:not(.indicator-circle):not([class*="indicator"])) {
  border-left-color: #9ca3af !important;
  border-right-color: #9ca3af !important;
  border-top-color: #9ca3af !important;
  border-bottom-color: #9ca3af !important;
}

/* Override any blue backgrounds that aren't indicators */
.status-timeline :deep(*:not(.indicator-circle)) [class*="bg-blue"],
.status-timeline :deep(*:not(.indicator-circle)) [class*="bg-primary"] {
  background-color: #9ca3af !important;
}

/* Try targeting UTimeline specific classes */
.status-timeline :deep(.relative) {
  border-color: #9ca3af !important;
}

.status-timeline :deep(.absolute) {
  background-color: #9ca3af !important;
  border-color: #9ca3af !important;
}

/* Force override with maximum specificity */
.timeline-wrapper .status-timeline :deep(.group) .relative {
  border-left: 2px solid #9ca3af !important;
}

.timeline-wrapper .status-timeline :deep(.group) .absolute {
  background-color: #9ca3af !important;
}

/* UUI Timeline specific overrides */
.status-timeline :deep(.group .relative::before),
.status-timeline :deep(.group .relative::after) {
  background-color: #9ca3af !important;
  border-color: #9ca3af !important;
}

/* Very aggressive approach - set all borders to grey */
.status-timeline :deep(*) {
  border-left-color: #9ca3af !important;
}

.status-timeline :deep(.border-l-2) {
  border-left: 2px solid #9ca3af !important;
}

/* CSS Variables approach */
.status-timeline {
  --ui-primary: #9ca3af;
  --primary-500: #9ca3af;
  --blue-500: #9ca3af;
}

/* UUI specific timeline line override */
.status-timeline :deep(.ui-timeline) .group .relative {
  border-left-color: #9ca3af !important;
}

/* Final nuclear option - use inline style approach */
.status-timeline :deep([style*="border"]) {
  border-color: #9ca3af !important;
}

.status-timeline :deep([style*="background"]):not(.indicator-circle) {
  background-color: #9ca3af !important;
}

/* Extended hardcoded CSS for items 4-9 */
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-COMPLETED .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-COMPLETED .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-6-COMPLETED .status-timeline .group:nth-child(7) .bg-primary,
.timeline-wrapper.item-6-COMPLETED .status-timeline .group:nth-child(7) [class*="bg-"],
.timeline-wrapper.item-6-COMPLETED .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-7-COMPLETED .status-timeline .group:nth-child(8) .bg-primary,
.timeline-wrapper.item-7-COMPLETED .status-timeline .group:nth-child(8) [class*="bg-"],
.timeline-wrapper.item-7-COMPLETED .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-8-COMPLETED .status-timeline .group:nth-child(9) .bg-primary,
.timeline-wrapper.item-8-COMPLETED .status-timeline .group:nth-child(9) [class*="bg-"],
.timeline-wrapper.item-8-COMPLETED .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-9-COMPLETED .status-timeline .group:nth-child(10) .bg-primary,
.timeline-wrapper.item-9-COMPLETED .status-timeline .group:nth-child(10) [class*="bg-"],
.timeline-wrapper.item-9-COMPLETED .status-timeline .group:nth-child(10) .indicator-circle {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-6-PENDING .status-timeline .group:nth-child(7) .bg-primary,
.timeline-wrapper.item-6-PENDING .status-timeline .group:nth-child(7) [class*="bg-"],
.timeline-wrapper.item-6-PENDING .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-7-PENDING .status-timeline .group:nth-child(8) .bg-primary,
.timeline-wrapper.item-7-PENDING .status-timeline .group:nth-child(8) [class*="bg-"],
.timeline-wrapper.item-7-PENDING .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-8-PENDING .status-timeline .group:nth-child(9) .bg-primary,
.timeline-wrapper.item-8-PENDING .status-timeline .group:nth-child(9) [class*="bg-"],
.timeline-wrapper.item-8-PENDING .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-9-PENDING .status-timeline .group:nth-child(10) .bg-primary,
.timeline-wrapper.item-9-PENDING .status-timeline .group:nth-child(10) [class*="bg-"],
.timeline-wrapper.item-9-PENDING .status-timeline .group:nth-child(10) .indicator-circle {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-FAILED .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-FAILED .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-6-FAILED .status-timeline .group:nth-child(7) .bg-primary,
.timeline-wrapper.item-6-FAILED .status-timeline .group:nth-child(7) [class*="bg-"],
.timeline-wrapper.item-6-FAILED .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-7-FAILED .status-timeline .group:nth-child(8) .bg-primary,
.timeline-wrapper.item-7-FAILED .status-timeline .group:nth-child(8) [class*="bg-"],
.timeline-wrapper.item-7-FAILED .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-8-FAILED .status-timeline .group:nth-child(9) .bg-primary,
.timeline-wrapper.item-8-FAILED .status-timeline .group:nth-child(9) [class*="bg-"],
.timeline-wrapper.item-8-FAILED .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-9-FAILED .status-timeline .group:nth-child(10) .bg-primary,
.timeline-wrapper.item-9-FAILED .status-timeline .group:nth-child(10) [class*="bg-"],
.timeline-wrapper.item-9-FAILED .status-timeline .group:nth-child(10) .indicator-circle {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-NOT_STARTED .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) .bg-primary,
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) [class*="bg-"],
.timeline-wrapper.item-4-CANCELLED .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-NOT_STARTED .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) .bg-primary,
.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) [class*="bg-"],
.timeline-wrapper.item-5-CANCELLED .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-6-NOT_STARTED .status-timeline .group:nth-child(7) .bg-primary,
.timeline-wrapper.item-6-NOT_STARTED .status-timeline .group:nth-child(7) [class*="bg-"],
.timeline-wrapper.item-6-NOT_STARTED .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-6-CANCELLED .status-timeline .group:nth-child(7) .bg-primary,
.timeline-wrapper.item-6-CANCELLED .status-timeline .group:nth-child(7) [class*="bg-"],
.timeline-wrapper.item-6-CANCELLED .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-7-NOT_STARTED .status-timeline .group:nth-child(8) .bg-primary,
.timeline-wrapper.item-7-NOT_STARTED .status-timeline .group:nth-child(8) [class*="bg-"],
.timeline-wrapper.item-7-NOT_STARTED .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-7-CANCELLED .status-timeline .group:nth-child(8) .bg-primary,
.timeline-wrapper.item-7-CANCELLED .status-timeline .group:nth-child(8) [class*="bg-"],
.timeline-wrapper.item-7-CANCELLED .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-8-NOT_STARTED .status-timeline .group:nth-child(9) .bg-primary,
.timeline-wrapper.item-8-NOT_STARTED .status-timeline .group:nth-child(9) [class*="bg-"],
.timeline-wrapper.item-8-NOT_STARTED .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-8-CANCELLED .status-timeline .group:nth-child(9) .bg-primary,
.timeline-wrapper.item-8-CANCELLED .status-timeline .group:nth-child(9) [class*="bg-"],
.timeline-wrapper.item-8-CANCELLED .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-9-NOT_STARTED .status-timeline .group:nth-child(10) .bg-primary,
.timeline-wrapper.item-9-NOT_STARTED .status-timeline .group:nth-child(10) [class*="bg-"],
.timeline-wrapper.item-9-NOT_STARTED .status-timeline .group:nth-child(10) .indicator-circle,
.timeline-wrapper.item-9-CANCELLED .status-timeline .group:nth-child(10) .bg-primary,
.timeline-wrapper.item-9-CANCELLED .status-timeline .group:nth-child(10) [class*="bg-"],
.timeline-wrapper.item-9-CANCELLED .status-timeline .group:nth-child(10) .indicator-circle {
  background-color: #9ca3af !important;
  color: white !important;
}

.timeline-wrapper.item-4-PENDING .status-timeline .group:nth-child(5) .indicator-circle,
.timeline-wrapper.item-5-PENDING .status-timeline .group:nth-child(6) .indicator-circle,
.timeline-wrapper.item-6-PENDING .status-timeline .group:nth-child(7) .indicator-circle,
.timeline-wrapper.item-7-PENDING .status-timeline .group:nth-child(8) .indicator-circle,
.timeline-wrapper.item-8-PENDING .status-timeline .group:nth-child(9) .indicator-circle,
.timeline-wrapper.item-9-PENDING .status-timeline .group:nth-child(10) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

@keyframes rotateIn {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg);
    opacity: 1;
  }
}

/* Ensure the wrapper has full width for flex layout */
.compact-timeline :deep(.group .wrapper) {
  width: 100% !important;
}

/* Status badge styling */
.flex-shrink-0 span {
  white-space: nowrap;
}

/* Ensure the flex container works properly */
.status-timeline :deep(.wrapper) {
  display: flex !important;
  align-items: flex-start !important;
  width: 100% !important;
}

/* Make sure the default content area takes full width */
.status-timeline :deep(.group) {
  position: relative;
}

.status-timeline :deep(.group .wrapper) {
  position: relative;
  width: 100%;
}

/* Status badges positioning */
.timeline-wrapper {
  position: relative;
}

.status-badges-container {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-top: 25px;
}

.status-badge-wrapper {
  display: flex;
  justify-content: flex-end;
  min-height: 50px;
  align-items: flex-start;
  margin-top: -2px;
}

.status-badge {
  white-space: nowrap;
  font-size: 11px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

/* Adjust gap between badges based on timeline spacing */
@media (min-width: 640px) {
  .status-badges-container {
    gap: 40px;
  }

  .status-badge-wrapper {
    min-height: 60px;
  }
}

/* Border bottom for timeline content wrapper - multiple selectors */
.status-timeline :deep([data-slot="wrapper"]),
.status-timeline :deep(.group .wrapper),
.timeline-wrapper :deep([data-slot="wrapper"]),
.compact-timeline :deep([data-slot="wrapper"]) {
  border-bottom: 1px solid #e5e7eb !important;
  padding-bottom: 1.5rem !important;
  margin-bottom: 0.5rem !important;
  display: block !important;
}

.status-timeline :deep(.group:last-child [data-slot="wrapper"]),
.status-timeline :deep(.group:last-child .wrapper),
.timeline-wrapper :deep(.group:last-child [data-slot="wrapper"]),
.compact-timeline :deep(.group:last-child [data-slot="wrapper"]) {
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

/* Dark mode wrapper border */
.dark-timeline .status-timeline :deep([data-slot="wrapper"]),
.dark-timeline .timeline-wrapper :deep([data-slot="wrapper"]),
.dark-timeline .compact-timeline :deep([data-slot="wrapper"]) {
  border-bottom-color: #374151 !important;
}

/* Alternative approach using nth-child for direct border application */
.status-timeline :deep(.group:nth-child(1) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(2) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(3) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(4) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(5) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(6) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(7) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(8) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }
.status-timeline :deep(.group:nth-child(9) [data-slot="wrapper"]) { border-bottom: 1px solid #e5e7eb !important; }

/* Direct class targeting for wrapper element */
.w-full.mt-1\.5.pb-6\.5 {
  border-bottom: 1px solid #e5e7eb !important;
}

/* Target within timeline context */
.status-timeline .w-full.mt-1\.5.pb-6\.5 {
  border-bottom: 1px solid #e5e7eb !important;
}

.timeline-wrapper .w-full.mt-1\.5.pb-6\.5 {
  border-bottom: 1px solid #e5e7eb !important;
}

/* Last item exception */
.status-timeline .group:last-child .w-full.mt-1\.5.pb-6\.5 {
  border-bottom: none !important;
}

/* Dark mode for specific class */
.dark-timeline .w-full.mt-1\.5.pb-6\.5,
.dark-timeline .status-timeline .w-full.mt-1\.5.pb-6\.5,
.dark-timeline .timeline-wrapper .w-full.mt-1\.5.pb-6\.5 {
  border-bottom-color: #374151 !important;
}
</style>
