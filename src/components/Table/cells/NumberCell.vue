<template>
  <div
    ref="editableRef"
    class="cell-container"
    :class="{ 'is-editable': editable && !disabled }"
    :contenteditable="editable && !disabled"
    inputmode="decimal"
    @input="handleInput"
    @keydown="handleKeydown"
    @keydown.enter.prevent="handleEnter"
    @blur="handleBlur"
  ></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  precision: {
    type: Number,
    default: null
  }
})

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const editableRef = ref<HTMLDivElement | null>(null)

const formatNumber = (value: number) => {
  if (value === null || value === undefined) return '\u00A0'
  if (props.precision === null || props.precision === undefined) return String(value)
  return value.toFixed(props.precision)
}

const syncFromModel = () => {
  const element = editableRef.value
  if (!element) return
  if (document.activeElement === element) return
  const text = formatNumber(props.modelValue)
  if (element.textContent !== text) {
    element.textContent = text
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.editable || props.disabled) return

  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', ',', '-', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (allowedKeys.includes(event.key)) return

  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLElement
  const text = (target.textContent || '').replace(/\u00A0/g, '').replace(',', '.')
  if (text === '' || text === '-') return

  const numValue = Number(text)
  if (!Number.isNaN(numValue)) {
    emit('update:value', numValue)
  }
}

const handleBlur = (event: FocusEvent) => {
  const target = event.target as HTMLElement
  const text = (target.textContent || '').replace(/\u00A0/g, '').replace(',', '.')

  if (text === '' || text === '-') {
    emit('update:value', 0)
    return
  }

  const numValue = Number(text)
  if (Number.isNaN(numValue)) {
    syncFromModel()
  }
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
  white-space: nowrap;
  outline: none;
  background: transparent;
  color: inherit;
}

.cell-container.is-editable {
  cursor: text;
}
</style>
