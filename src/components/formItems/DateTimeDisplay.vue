<template>
  <div class="datetime-display" :title="showTooltip ? formattedFull : ''">
    <i v-if="elapsed" class="bi bi-clock-history me-1"></i>
    <i v-else class="bi bi-calendar-event me-1"></i>
    <span>{{ displayValue }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Date, Number],
    default: null
  },
  autoToggle: {
    type: Boolean,
    default: false
  },
  elapsed: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'datetime'
  },
  customFormat: {
    type: String,
    default: ''
  },
  dateOnly: {
    type: Boolean,
    default: false
  },
  timeOnly: {
    type: Boolean,
    default: false
  }
})

const now = ref(Date.now())
let intervalId: number | null = null

onMounted(() => {
  if (props.elapsed) {
    intervalId = window.setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const getDate = computed(() => {
  if (!props.modelValue) return null
  if (props.modelValue instanceof Date) return props.modelValue
  if (typeof props.modelValue === 'number') return new Date(props.modelValue)
  return new Date(props.modelValue)
})

const formattedFull = computed(() => {
  const date = getDate.value
  if (!date || isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const formatElapsed = (ms: number): string => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h ago`
  if (hours > 0) return `${hours}h ${minutes % 60}m ago`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`
  return `${seconds}s ago`
}

const displayValue = computed(() => {
  const date = getDate.value
  if (!date || isNaN(date.getTime())) return 'Invalid Date'

  if (props.elapsed) {
    const elapsed = now.value - date.getTime()
    return formatElapsed(elapsed)
  }

  if (props.customFormat) {
    return formatCustom(date, props.customFormat)
  }

  if (props.dateOnly) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (props.timeOnly) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const formatCustom = (date: Date, format: string): string => {
  const map: Record<string, string> = {
    'YYYY': date.getFullYear().toString(),
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'DD': String(date.getDate()).padStart(2, '0'),
    'HH': String(date.getHours()).padStart(2, '0'),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'ss': String(date.getSeconds()).padStart(2, '0')
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => map[match] || match)
}

const showTooltip = computed(() => props.elapsed || props.customFormat)
</script>

<style lang="scss" scoped>
.datetime-display {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: default;

  i {
    opacity: 0.7;
    font-size: 0.875em;
  }
}
</style>
