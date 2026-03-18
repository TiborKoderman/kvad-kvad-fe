<template>
  <div class="alert-backdrop" @click.self="handleBackdropClick">
    <div :class="alertClasses" role="alert">
      <!-- Icon -->
      <div class="alert-icon">
        <i :class="iconClass" :style="iconStyle"></i>
      </div>

      <!-- Content -->
      <div class="alert-content">
        <div class="alert-message">{{ message }}</div>
        <div v-if="description" class="alert-description">{{ description }}</div>
      </div>

      <!-- Actions -->
      <div v-if="actionButtons.length > 0" class="alert-actions">
        <Button
          v-for="action in actionButtons"
          :key="action.key"
          v-bind="getButtonProps(action)"
          @click="handleActionClick(action)"
        >
          {{ action.label }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/formItems/Button.vue'
import type { AlertConfig, ActionButton, AlertAction } from './alert'
import type { ThemeVariant } from '@/assets/themes/theme-config'

const props = defineProps<AlertConfig>()

const emit = defineEmits<{
  action: [actionKey: string, value?: any]
}>()

// Compute alert classes based on variant
const alertClasses = computed(() => {
  const classes = ['alert-container']
  if (props.variant) {
    classes.push(`alert-${props.variant}`)
  }
  return classes
})

// Compute icon class
const iconClass = computed(() => {
  if (typeof props.icon === 'string') {
    return props.icon.startsWith('bi-') ? `bi ${props.icon}` : props.icon
  }

  // Default icons for variants
  const defaultIcons: Record<string, string> = {
    info: 'bi bi-info-circle-fill',
    success: 'bi bi-check-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    danger: 'bi bi-x-circle-fill',
    error: 'bi bi-x-circle-fill',
  }

  return defaultIcons[props.variant || 'info'] || 'bi bi-info-circle-fill'
})

// Compute icon style
const iconStyle = computed(() => {
  if (props.color) {
    return { color: props.color }
  }
  return {}
})

// Process actions into button array
const actionButtons = computed<ActionButton[]>(() => {
  if (!props.actions) return []

  const buttons: ActionButton[] = []

  for (const [key, action] of Object.entries(props.actions)) {
    if (typeof action === 'function') {
      // Simple function action
      const label = key === 'ok' || key === 'confirm' ? 'OK' :
                    key === 'cancel' ? 'Cancel' :
                    key === 'close' ? 'Close' :
                    key
      const isCloseCancel = key === 'cancel' || key === 'close'
      buttons.push({
        key,
        label,
        handler: action,
        variant: key === 'ok' || key === 'confirm' ? 'primary' : 'dark',
        outline: isCloseCancel
      })
    } else {
      // Object action with custom config
      const isCloseCancel = key === 'cancel' || key === 'close'
      buttons.push({
        key,
        label: action.label || key,
        handler: action.handler,
        variant: action.variant || (key === 'ok' || key === 'confirm' ? 'primary' : 'dark'),
        outline: action.outline !== undefined ? action.outline : isCloseCancel
      })
    }
  }

  return buttons
})

// Get button props
const getButtonProps = (action: ActionButton) => {
  const variantProp: Record<string, boolean> = {}
  if (action.variant) {
    variantProp[action.variant] = true
  }
  if (action.outline) {
    variantProp.outline = true
  }
  return variantProp
}

// Handle action click
const handleActionClick = async (action: ActionButton) => {
  let result: any

  if (action.handler) {
    result = await action.handler()
  }

  emit('action', action.key, result)
}

// Handle backdrop click (close on backdrop click for cancel)
const handleBackdropClick = () => {
  if (props.actions?.cancel || props.actions?.close) {
    emit('action', props.actions?.close ? 'close' : 'cancel')
  }
}
</script>

<style scoped>
.alert-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.alert-container {
  background-color: var(--t-card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  animation: alertSlideIn 0.2s ease-out;
}

@keyframes alertSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.alert-icon {
  flex-shrink: 0;
  font-size: 2rem;
  line-height: 1;
}

.alert-icon i {
  display: block;
}

/* Variant-specific icon colors */
.alert-info .alert-icon { color: var(--t-info); }
.alert-success .alert-icon { color: var(--t-success); }
.alert-warning .alert-icon { color: var(--t-warning); }
.alert-danger .alert-icon, .alert-error .alert-icon { color: var(--t-danger); }
.alert-primary .alert-icon { color: var(--t-primary); }
.alert-secondary .alert-icon { color: var(--t-secondary); }

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-message {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--t-body-color);
  line-height: 1.4;
}

.alert-description {
  font-size: 0.9rem;
  color: var(--t-body-color);
  opacity: 0.85;
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--t-border-color);
  grid-column: 1 / -1;
}

.alert-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  gap: 1rem;
}

.alert-actions {
  grid-column: 1 / -1;
}
</style>
