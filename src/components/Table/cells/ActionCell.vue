<template>
  <div class="action-cell">
    <button
      v-for="(action, index) in actions"
      :key="index"
      @click="action.handler(rowData)"
      :class="['btn', `btn-${action.variant || 'primary'}`]"
      :disabled="disabled || action.disabled"
    >
      {{ action.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

interface Action {
  label: string
  handler: (rowData: any) => void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  disabled?: boolean
}

defineProps({
  actions: {
    type: Array as PropType<Action[]>,
    default: () => []
  },
  rowData: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.action-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  padding: 0.125rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.813rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color, #007bff);
  color: white;
}

.btn-secondary {
  background: var(--secondary-color, #6c757d);
  color: white;
}

.btn-danger {
  background: var(--danger-color, #dc3545);
  color: white;
}

.btn-success {
  background: var(--success-color, #28a745);
  color: white;
}
</style>
