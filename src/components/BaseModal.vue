<template>
  <div
    ref="backdropRef"
    class="base-modal-backdrop"
    tabindex="-1"
    @click.self="handleBackdropClick"
    @keydown="handleKeydown"
  >
    <div
      class="base-modal-dialog"
      :class="{ fullscreen }"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="base-modal-content">
        <div class="base-modal-header">
          <h4 :id="titleId" class="base-modal-title">{{ title }}</h4>
          <button
            type="button"
            class="base-modal-close"
            aria-label="Close"
            @click="emit('close')"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </div>

        <div class="base-modal-body">
          <slot></slot>
        </div>

        <div v-if="buttons.length > 0" class="base-modal-footer">
          <Button
            v-for="button in buttons"
            :key="button.key"
            v-bind="getButtonProps(button)"
            @click="emit('action', button.key)"
          >
            {{ button.label }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import type { ThemeVariant } from '@/assets/themes/theme-config'
import Button from '@/components/formItems/Button.vue'

export interface BaseModalActionButton {
  key: string
  label: string
  variant?: ThemeVariant
  outline?: boolean
}

const props = withDefaults(
  defineProps<{
    title?: string
    fullscreen?: boolean
    closeOnBackdrop?: boolean
    buttons?: BaseModalActionButton[]
  }>(),
  {
    title: 'Modal',
    fullscreen: true,
    closeOnBackdrop: true,
    buttons: () => [],
  },
)

const emit = defineEmits<{
  close: []
  action: [actionKey: string]
}>()

const backdropRef = ref<HTMLElement | null>(null)
const titleId = `base-modal-title-${Math.random().toString(36).slice(2)}`

const getButtonProps = (button: BaseModalActionButton) => {
  const variantProps: Record<string, boolean> = {}

  if (button.variant) {
    variantProps[button.variant] = true
  }

  if (button.outline) {
    variantProps.outline = true
  }

  return variantProps
}

const getPrimaryActionKey = () => {
  const preferredAction = props.buttons.find(button =>
    ['ok', 'save', 'submit', 'confirm'].includes(button.key),
  )

  return preferredAction?.key ?? props.buttons[0]?.key
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null

  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
    return
  }

  if (event.key === 'Enter') {
    const actionKey = getPrimaryActionKey()

    if (actionKey) {
      event.preventDefault()
      emit('action', actionKey)
    }
  }
}

onMounted(async () => {
  await nextTick()
  backdropRef.value?.focus()
})
</script>

<style scoped lang="scss">
$border-color: rgba(#000000, 0.18);

.base-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.55);
  outline: none;
}

.base-modal-dialog {
  width: min(680px, calc(100vw - 3rem));
  max-height: calc(100vh - 3rem);
}

.base-modal-dialog.fullscreen {
  width: min(1200px, calc(100vw - 3rem));
}

.base-modal-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - 3rem);
  background-color: var(--t-card-bg);
  border: 1px solid var(--t-card-border-color);
  border-radius: var(--bs-border-radius-lg);
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.22);
}

.base-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid $border-color;
}

.base-modal-title {
  margin: 0;
  color: var(--t-body-color);
  font-size: 1.1rem;
  font-weight: 600;
}

.base-modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: var(--t-body-color);
  background: transparent;
  border: 0;
  border-radius: 999px;
}

.base-modal-close:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.base-modal-close:focus-visible {
  outline: 2px solid var(--t-primary);
  outline-offset: 2px;
}

.base-modal-body {
  flex: 1;
  overflow: auto;
  padding: 1.25rem;
}

.base-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem 1.25rem;
  border-top: 1px solid $border-color;
}

@media (max-width: 768px) {
  .base-modal-backdrop {
    padding: 0.75rem;
  }

  .base-modal-dialog,
  .base-modal-dialog.fullscreen {
    width: calc(100vw - 1.5rem);
  }

  .base-modal-content {
    max-height: calc(100vh - 1.5rem);
  }

  .base-modal-header,
  .base-modal-body,
  .base-modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
