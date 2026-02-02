<template>
  <div class="timedatepicker">
    <div class="picker-controls mb-2">
      <div class="btn-group btn-group-sm" role="group">
        <button
          type="button"
          class="btn"
          :class="mode === 'datetime' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="mode = 'datetime'"
        >
          <i class="bi bi-calendar-event"></i> Date & Time
        </button>
        <button
          type="button"
          class="btn"
          :class="mode === 'date' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="mode = 'date'"
        >
          <i class="bi bi-calendar"></i> Date Only
        </button>
        <button
          type="button"
          class="btn"
          :class="mode === 'time' ? 'btn-primary' : 'btn-outline-secondary'"
          @click="mode = 'time'"
        >
          <i class="bi bi-clock"></i> Time Only
        </button>
      </div>
      <div class="form-check form-switch ms-3">
        <input
          class="form-check-input"
          type="checkbox"
          id="rangeToggle"
          v-model="isRange"
        />
        <label class="form-check-label" for="rangeToggle">Range</label>
      </div>
    </div>

    <div v-if="!isRange" class="single-picker">
      <input
        v-if="mode === 'datetime'"
        type="datetime-local"
        class="form-control"
        :value="formatForInput(internalValue)"
        @input="updateValue($event.target.value)"
      />
      <input
        v-else-if="mode === 'date'"
        type="date"
        class="form-control"
        :value="formatDateOnly(internalValue)"
        @input="updateValue($event.target.value)"
      />
      <input
        v-else
        type="time"
        class="form-control"
        :value="formatTimeOnly(internalValue)"
        @input="updateValue($event.target.value)"
      />
    </div>

    <div v-else class="range-picker">
      <div class="row g-2">
        <div class="col">
          <label class="form-label small">Start</label>
          <input
            v-if="mode === 'datetime'"
            type="datetime-local"
            class="form-control"
            :value="formatForInput(rangeStart)"
            @input="updateRangeStart($event.target.value)"
          />
          <input
            v-else-if="mode === 'date'"
            type="date"
            class="form-control"
            :value="formatDateOnly(rangeStart)"
            @input="updateRangeStart($event.target.value)"
          />
          <input
            v-else
            type="time"
            class="form-control"
            :value="formatTimeOnly(rangeStart)"
            @input="updateRangeStart($event.target.value)"
          />
        </div>
        <div class="col">
          <label class="form-label small">End</label>
          <input
            v-if="mode === 'datetime'"
            type="datetime-local"
            class="form-control"
            :value="formatForInput(rangeEnd)"
            @input="updateRangeEnd($event.target.value)"
          />
          <input
            v-else-if="mode === 'date'"
            type="date"
            class="form-control"
            :value="formatDateOnly(rangeEnd)"
            @input="updateRangeEnd($event.target.value)"
          />
          <input
            v-else
            type="time"
            class="form-control"
            :value="formatTimeOnly(rangeEnd)"
            @input="updateRangeEnd($event.target.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Date, Object],
    default: null
  },
  initialMode: {
    type: String as () => 'datetime' | 'date' | 'time',
    default: 'datetime'
  },
  range: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | { start: string; end: string }): void
  (e: 'update:mode', mode: 'datetime' | 'date' | 'time'): void
  (e: 'update:range', isRange: boolean): void
}>()

const mode = ref<'datetime' | 'date' | 'time'>(props.initialMode)
const isRange = ref(props.range)
const internalValue = ref(props.modelValue || new Date().toISOString())
const rangeStart = ref(new Date().toISOString())
const rangeEnd = ref(new Date().toISOString())

watch(() => props.modelValue, (newVal) => {
  if (newVal && typeof newVal === 'object' && 'start' in newVal) {
    rangeStart.value = newVal.start
    rangeEnd.value = newVal.end
  } else if (newVal) {
    internalValue.value = newVal
  }
})

watch(mode, (newMode) => {
  emit('update:mode', newMode)
})

watch(isRange, (newIsRange) => {
  emit('update:range', newIsRange)
})

const formatForInput = (value: string | Date) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 16)
}

const formatDateOnly = (value: string | Date) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(0, 10)
}

const formatTimeOnly = (value: string | Date) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().slice(11, 16)
}

const updateValue = (value: string) => {
  internalValue.value = value
  emit('update:modelValue', value)
}

const updateRangeStart = (value: string) => {
  rangeStart.value = value
  emit('update:modelValue', { start: rangeStart.value, end: rangeEnd.value })
}

const updateRangeEnd = (value: string) => {
  rangeEnd.value = value
  emit('update:modelValue', { start: rangeStart.value, end: rangeEnd.value })
}
</script>

<style lang="scss" scoped>
.timedatepicker {
  padding: 0.75rem;
  background: var(--t-card-bg, #fff);
  border: 1px solid var(--t-border-color, #dee2e6);
  border-radius: 0.375rem;
  min-width: 300px;
}

.picker-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;

  i {
    font-size: 0.875rem;
  }
}

.btn-primary {
  background-color: var(--t-primary, #b00b69);
  border-color: var(--t-primary, #b00b69);
  color: var(--txt-primary, #fff);

  &:hover {
    background-color: var(--t-primary, #900955);
    border-color: var(--t-primary, #900955);
  }
}

.btn-outline-secondary {
  color: var(--t-body-color, #6c757d);
  border-color: var(--t-border-color, #dee2e6);

  &:hover {
    background-color: var(--bg-light, #f8f9fa);
    color: var(--t-body-color, #495057);
  }
}

.form-check-input {
  cursor: pointer;

  &:checked {
    background-color: var(--t-primary, #b00b69);
    border-color: var(--t-primary, #b00b69);
  }

  &:focus {
    border-color: var(--t-primary, #b00b69);
    border-width: 2px;
  }
}
</style>
