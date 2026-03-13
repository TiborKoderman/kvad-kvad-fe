<template>
  <div
    class="guid-cell"
    v-tooltip="{ content: tooltipContent, position: 'top' }"
    @click="copy"
  >
    <span class="guid-badge" :class="{ copied }">
      <span class="guid-short">{{ short }}</span>
      <i class="bi" :class="copied ? 'bi-check' : 'bi-clipboard'"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const copied = ref(false)

const short = computed(() => {
  if (!props.modelValue) return '—'
  // Show first 8 chars (first segment of a UUID)
  return props.modelValue.slice(0, 8)
})

const tooltipContent = computed(() => {
  if (!props.modelValue) return 'No GUID'
  return copied.value ? 'Copied to clipboard' : `Copy GUID: ${props.modelValue}`
})

const copy = async () => {
  if (!props.modelValue) return
  try {
    await navigator.clipboard.writeText(props.modelValue)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    copied.value = false
  }
}
</script>

<style scoped>
.guid-cell {
  display: inline-flex;
}

.guid-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  font-size: 0.75rem;
  font-family: ui-monospace, 'SFMono-Regular', monospace;
  background: var(--t-primary);
  color: var(--txt-primary);
  border: 1px solid var(--t-primary);
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  white-space: nowrap;
}

.guid-badge:hover {
  filter: brightness(0.94);
}

.guid-badge.copied {
  background: var(--t-success);
  border-color: var(--t-success);
  color: var(--txt-success);
}

.guid-badge i {
  font-size: 0.7rem;
  flex-shrink: 0;
}
</style>
