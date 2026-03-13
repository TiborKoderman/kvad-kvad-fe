<template>
  <div
    ref="editableRef"
    class="cell-container"
    :class="{ 'is-editable': editable && !disabled }"
    :contenteditable="editable && !disabled"
    @input="handleInput"
    @keydown.enter.prevent="handleEnter"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const editableRef = ref<HTMLDivElement | null>(null)

const displayValue = (value: string | number) => {
  const text = String(value ?? '')
  return text.length ? text : '\u00A0'
}

const syncFromModel = () => {
  const element = editableRef.value
  if (!element) return
  if (document.activeElement === element) return
  const text = displayValue(props.modelValue)
  if (element.textContent !== text) {
    element.textContent = text
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLElement
  const value = (target.textContent || '').replace(/\u00A0/g, '')
  emit('update:value', value)
}

const handleEnter = (event: KeyboardEvent) => {
  ;(event.target as HTMLElement)?.blur()
}

watch(() => props.modelValue, syncFromModel)

onMounted(() => {
  syncFromModel()
})
</script>

<style scoped>
.cell-container {
  width: 100%;
  min-height: 1.5rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  outline: none;
  background: transparent;
  color: inherit;
}

.cell-container.is-editable {
  cursor: text;
}
</style>
