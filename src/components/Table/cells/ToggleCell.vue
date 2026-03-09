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
  border: 2px solid var(--t-border-color);
  border-radius: 0.3rem;
  background: var(--t-card-bg);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-icon {
  width: 1rem;
  height: 1rem;
  fill: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox-check {
  stroke-dasharray: 29;
  stroke-dashoffset: 29;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover state */
.custom-checkbox:hover .checkbox-box {
  border-color: var(--t-primary);
  background: var(--bg-light-subtle);
}

/* Checked state */
.checkbox-input:checked + .checkbox-box {
  background: var(--t-primary);
  border-color: var(--t-primary);
  animation: checkboxPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.checkbox-input:checked + .checkbox-box .checkbox-icon {
  opacity: 1;
  transform: scale(1);
  animation: checkmarkDraw 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
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
  border-color: var(--t-border-color);
}

/* Focus state for accessibility */
.checkbox-input:focus-visible + .checkbox-box {
  outline: 2px solid var(--t-primary);
  outline-offset: 2px;
}

@keyframes checkboxPop {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.15);
  }
  60% {
    transform: scale(0.96);
  }
  80% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes checkmarkDraw {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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
