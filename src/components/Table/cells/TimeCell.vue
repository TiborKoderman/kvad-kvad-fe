<template>
  <div class="cell-container" @dblclick="startEdit">
    <input
      v-if="isEditing && editable"
      ref="inputRef"
      type="datetime-local"
      :value="formatForInput(modelValue)"
      :disabled="disabled"
      @input="$emit('update:value', $event.target.value)"
      @blur="stopEdit"
      @keydown.enter="stopEdit"
      @keydown.esc="stopEdit"
      class="form-control"
    />
    <span v-else class="cell-value">{{ formatForDisplay(modelValue) }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'datetime'
  }
})

defineEmits<{
  (e: 'update:value', value: string): void
}>()

const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const formatForInput = (value: string | Date) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 16)
}

const formatForDisplay = (value: string | Date) => {
  if (!value) return '\u00A0'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleString()
}

const startEdit = () => {
  if (props.editable && !props.disabled) {
    isEditing.value = true
    nextTick(() => {
      inputRef.value?.focus()
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
}

.form-control {
  width: 100%;
  padding: 0.125rem 0.25rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 0.25rem;
  background: var(--input-bg, white);
  color: var(--text-color, black);
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
}
</style>
