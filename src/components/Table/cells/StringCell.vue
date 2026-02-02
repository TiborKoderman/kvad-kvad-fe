<template>
  <div class="cell-container" :class="{ editing: isEditing }" @dblclick.self="startEdit">
    <span
      v-if="isEditing && editable"
      ref="editableRef"
      contenteditable="true"
      :data-disabled="disabled"
      @input="handleInput"
      @blur="stopEdit"
      @keydown.enter.prevent="stopEdit"
      @keydown.esc="stopEdit"
      @dblclick.stop
      class="cell-editable"
    >{{ modelValue }}</span>
    <span v-else class="cell-value" @dblclick="startEdit">{{ modelValue || '\u00A0' }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
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

const isEditing = ref(false)
const editableRef = ref<HTMLSpanElement | null>(null)

const handleInput = (event: Event) => {
  const target = event.target as HTMLElement
  emit('update:value', target.textContent || '')
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
  padding: 0.25rem 0.375rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  transition: all 0.15s ease;
  margin: -0.25rem -0.375rem;
}

.cell-container:hover:not(.editing) {
  border-color: var(--t-border-color, #dee2e6);
  background: var(--bg-light-subtle, #f8f9fa);
  cursor: text;
}

.cell-container.editing {
  border-color: var(--t-primary, #b00b69);
  background: var(--t-input-bg, white);
}

.cell-value {
  display: inline-block;
  min-height: 1.5rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.cell-editable {
  display: inline-block;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--t-input-color, black);
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  line-height: 1.5;
  outline: none;
  white-space: pre-wrap;
  word-break: break-word;
  min-height: 1.5rem;
}

.cell-editable[data-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
