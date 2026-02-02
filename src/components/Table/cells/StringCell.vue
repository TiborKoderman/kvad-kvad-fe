<template>
  <div class="cell-container" @dblclick.self="startEdit">
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
}

.cell-value {
  display: inline-block;
  padding: 0.125rem 0.25rem;
  min-height: 1.5rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
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
  white-space: pre-wrap;
  word-break: break-word;
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
