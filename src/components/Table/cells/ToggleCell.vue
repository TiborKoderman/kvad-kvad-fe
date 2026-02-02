<template>
  <div class="cell-container">
    <label class="custom-checkbox">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled || !editable"
        @change="handleToggle"
        class="checkbox-input"
      />
      <span class="checkbox-box">
        <svg class="checkbox-icon" viewBox="0 0 24 24">
          <path
            class="checkbox-check"
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
          />
        </svg>
      </span>
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'update:value', value: boolean): void
}>()

const handleToggle = (event: Event) => {
  if (props.editable && !props.disabled) {
    emit('update:value', (event.target as HTMLInputElement).checked)
  }
}
</script>

<style scoped>
.cell-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.5rem;
  padding: 0.125rem 0.25rem;
}

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-box {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--bs-border-color, #adb5bd);
  border-radius: 0.3rem;
  background: var(--bs-body-bg, white);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.checkbox-icon {
  width: 1rem;
  height: 1rem;
  fill: white;
  opacity: 0;
  transform: scale(0) rotate(-180deg);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox-check {
  stroke-dasharray: 29;
  stroke-dashoffset: 29;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover state */
.custom-checkbox:hover .checkbox-box {
  border-color: var(--bs-primary, #0d6efd);
  box-shadow: 0 0 0 3px var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.15)),
              0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Checked state */
.checkbox-input:checked + .checkbox-box {
  background: var(--bs-primary, #0d6efd);
  border-color: var(--bs-primary, #0d6efd);
  animation: checkboxPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 0 0 3px var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.2)),
              0 6px 12px rgba(13, 110, 253, 0.3);
}

.checkbox-input:checked + .checkbox-box .checkbox-icon {
  opacity: 1;
  transform: scale(1.1) rotate(0deg);
  animation: checkmarkDraw 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

.checkbox-input:checked + .checkbox-box .checkbox-check {
  stroke-dashoffset: 0;
  animation: checkmarkStroke 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Disabled state */
.checkbox-input:disabled + .checkbox-box {
  opacity: 0.5;
  cursor: not-allowed;
}

.custom-checkbox:has(.checkbox-input:disabled) {
  cursor: not-allowed;
}

.custom-checkbox:has(.checkbox-input:disabled):hover .checkbox-box {
  border-color: var(--border-color, #adb5bd);
  box-shadow: none;
}

/* Focus state for accessibility */
.checkbox-input:focus-visible + .checkbox-box {
  outline: 2px solid var(--bs-primary, #0d6efd);
  outline-offset: 2px;
}

@keyframes checkboxPop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  30% {
    transform: scale(1.2) rotate(-5deg);
  }
  60% {
    transform: scale(0.9) rotate(5deg);
  }
  80% {
    transform: scale(1.05) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes checkmarkDraw {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3) rotate(-90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1.1) rotate(0deg);
  }
}

@keyframes checkmarkStroke {
  0% {
    stroke-dashoffset: 29;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* Active state - more feedback */
.custom-checkbox:active .checkbox-box {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}
</style>
