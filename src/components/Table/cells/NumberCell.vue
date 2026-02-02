<template>
  <div class="cell-container" @dblclick.self="startEdit">
    <span
      v-if="isEditing && editable"
      ref="editableRef"
      contenteditable="true"
      inputmode="numeric"
      :data-disabled="disabled"
      @input="handleInput"
      @blur="stopEdit"
      @keydown.enter.prevent="stopEdit"
      @keydown.esc="stopEdit"
      @keydown="handleKeydown"
      @dblclick.stop
      class="cell-editable"
    >{{ modelValue }}</span>
    <span v-else class="cell-value" @dblclick="startEdit">{{ formatNumber(modelValue) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

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
    default: 2
  }
})

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const isEditing = ref(false)
const editableRef = ref<HTMLSpanElement | null>(null)

const formatNumber = (value: number) => {
  if (value === null || value === undefined) return '\u00A0'
  return value.toFixed(props.precision)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Allow: backspace, delete, tab, escape, enter, decimal point, minus
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', '.', '-', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

  if (allowedKeys.includes(event.key)) {
    return
  }

  // Allow: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
    return
  }

  // Ensure that it is a number
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLElement
  const text = target.textContent || ''
  const numValue = parseFloat(text)

  if (!isNaN(numValue)) {
    emit('update:value', numValue)
  } else if (text === '' || text === '-') {
    emit('update:value', 0)
  }
}

const startEdit = () => {
  if (props.editable && !props.disabled) {
    isEditing.value = true
    nextTick(() => {
      if (editableRef.value) {
        editableRef.value.focus()
        // Select all text
        const range = document.createRange()
        range.selectNodeContents(editableRef.value)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    })
  }
}

const stopEdit = () => {
  isEditing.value = false
}
</script>

<style scoped>
.cell-container {
  min-height: 1.5rem;
  width: 100%;
}

.cell-value {
  display: inline-block;
  padding: 0.125rem 0.25rem;
  min-height: 1.5rem;
  line-height: 1.5;
  white-space: nowrap;
}

.cell-editable {
  display: inline-block;
  width: 100%;
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--bs-primary, #0d6efd);
  border-radius: 0.25rem;
  background: var(--bs-body-bg, white);
  color: var(--bs-body-color, black);
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  white-space: nowrap;
  min-height: 1.5rem;
  box-shadow: 0 0 0 0.25rem var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.25));
  transition: all 0.2s ease;
}

.cell-editable:focus {
  border-color: var(--bs-primary, #0d6efd);
}

.cell-editable[data-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
