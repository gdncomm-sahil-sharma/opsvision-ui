<script setup>
import { computed } from 'vue'
import moment from 'moment'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
    timelineData: {
        type: Array,
        required: true,
        default: () => []
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
        case 'IN_PROGRESS':
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
    case 'IN_PROGRESS':
        return 'bg-blue-500'
    case 'FAILED':
        return 'bg-red-500'
    case 'NOT_STARTED':
        return 'bg-gray-400'
    default:
        return 'bg-gray-400'
    }
}
</script>

<template>
    <div
        class="max-w-2xl mx-auto p-6 rounded-lg transition-colors duration-300"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
    >
        <div class="mb-6">
            <h3
                class="text-xl font-bold text-left"
                :class="isDark ? 'text-white' : 'text-gray-900'"
            >
                Project Timeline
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

.timeline-wrapper.item-0-COMPLETED .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-COMPLETED .status-timeline .group:nth-child(1) [class*="bg-"] {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-1-COMPLETED .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-COMPLETED .status-timeline .group:nth-child(2) [class*="bg-"] {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-2-COMPLETED .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-COMPLETED .status-timeline .group:nth-child(3) [class*="bg-"] {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-3-COMPLETED .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-COMPLETED .status-timeline .group:nth-child(4) [class*="bg-"] {
  background-color: #22c55e !important;
  color: white !important;
}

.timeline-wrapper.item-0-IN_PROGRESS .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-IN_PROGRESS .status-timeline .group:nth-child(1) [class*="bg-"] {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-1-IN_PROGRESS .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-IN_PROGRESS .status-timeline .group:nth-child(2) [class*="bg-"] {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-2-IN_PROGRESS .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-IN_PROGRESS .status-timeline .group:nth-child(3) [class*="bg-"] {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-3-IN_PROGRESS .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-IN_PROGRESS .status-timeline .group:nth-child(4) [class*="bg-"] {
  background-color: #3b82f6 !important;
  color: white !important;
}

.timeline-wrapper.item-0-FAILED .status-timeline .group:nth-child(1) .bg-primary,
.timeline-wrapper.item-0-FAILED .status-timeline .group:nth-child(1) [class*="bg-"] {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-1-FAILED .status-timeline .group:nth-child(2) .bg-primary,
.timeline-wrapper.item-1-FAILED .status-timeline .group:nth-child(2) [class*="bg-"] {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-2-FAILED .status-timeline .group:nth-child(3) .bg-primary,
.timeline-wrapper.item-2-FAILED .status-timeline .group:nth-child(3) [class*="bg-"] {
  background-color: #ef4444 !important;
  color: white !important;
}

.timeline-wrapper.item-3-FAILED .status-timeline .group:nth-child(4) .bg-primary,
.timeline-wrapper.item-3-FAILED .status-timeline .group:nth-child(4) [class*="bg-"] {
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

.timeline-wrapper.item-0-IN_PROGRESS .status-timeline .group:nth-child(1) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-1-IN_PROGRESS .status-timeline .group:nth-child(2) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-2-IN_PROGRESS .status-timeline .group:nth-child(3) .indicator-circle {
  animation: pulse 2s infinite;
  border-radius: 50%;
}

.timeline-wrapper.item-3-IN_PROGRESS .status-timeline .group:nth-child(4) .indicator-circle {
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
</style>
