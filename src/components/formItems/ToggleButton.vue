<template>
  <div class="toggle-container">
      <div class="toggle-button form-toggle-input" :class="{ 'is-checked': modelValue }" @click="toggle">
          <div class="toggle-pill">
              <svg class="toggle-icon" viewBox="0 0 24 24">
                  <line class="line line-1" x1="6" y1="6" x2="18" y2="18" />
                  <line class="line line-2" x1="18" y1="6" x2="6" y2="18" />
                  <polyline class="checkmark" points="6 12 10 16 18 8" />
                </svg>
            </div>
        </div>
        <label v-if="label" class="toggle-label">{{ label }}</label>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<style scoped>
.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0; /* Added margin to top and bottom */
}

.toggle-label {
  font-size: 1rem;
  color: var(--bs-dark);
}

.toggle-button {
  width: 3rem;
  height: 1.5rem;
  background-color: #ccc;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  position: relative;
  overflow: hidden;
}

.toggle-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.toggle-button:hover::after {
  width: 200%;
  height: 200%;
  opacity: 1;
}

.toggle-button.is-checked {
  background-color: var(--bs-primary);
}

.toggle-pill {
  width: 1rem;
  height: 1rem;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.toggle-button.is-checked .toggle-pill {
  transform: translateX(1.5rem);
}

.toggle-icon {
  width: 100%;
  height: 100%;
  stroke-width: 2;
  fill: none;
}

.line {
  stroke: #ccc;
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.toggle-button.is-checked .line {
  opacity: 0;
  transform: scale(0);
}

.checkmark {
  stroke: var(--bs-dark);
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.toggle-button.is-checked .checkmark {
  opacity: 1;
  transform: scale(1);
}
</style>
