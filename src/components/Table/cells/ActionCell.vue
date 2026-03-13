<template>
  <div class="action-cell">
    <button
      v-for="(action, index) in actions"
      :key="index"
      @click="action.handler(rowData)"
      :class="['action-btn', `action-btn--${action.variant || 'primary'}`]"
      :disabled="disabled || action.disabled"
      :title="action.label"
    >
      <i v-if="action.icon" :class="['bi', action.icon]"></i>
      <span v-else>{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

interface Action {
  label: string
  icon?: string
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
  gap: 0.25rem;
  justify-content: flex-end;
  align-items: center;
  white-space: nowrap;
}

.action-btn {
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.45rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--t-body-color);
  cursor: pointer;
  font-size: 0.8125rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.action-btn i {
  font-size: 0.875rem;
}

.action-btn--primary {
  color: var(--t-primary);
}

.action-btn--secondary {
  color: var(--t-body-color);
}

.action-btn--danger {
  color: var(--t-danger);
}

.action-btn--success {
  color: var(--t-success);
}

.action-btn:hover:not(:disabled) {
  background: var(--t-table-hover-bg);
  border-color: currentColor;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
