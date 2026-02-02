<template>
  <div class="cell-container">
    <div v-if="isEditing && editable" class="picker-wrapper">
      <TimeDatePicker
        :modelValue="modelValue"
        :initialMode="pickerMode"
        :range="false"
        @update:modelValue="handleUpdate"
      />
      <div class="picker-actions mt-2">
        <button class="btn btn-sm btn-primary" @click="stopEdit">
          <i class="bi bi-check"></i> Done
        </button>
        <button class="btn btn-sm btn-outline-secondary" @click="cancelEdit">
          <i class="bi bi-x"></i> Cancel
        </button>
      </div>
    </div>
    <div v-else @dblclick.stop="startEdit" class="display-wrapper">
      <DateTimeDisplay
        :modelValue="modelValue"
        :elapsed="showElapsed"
        :dateOnly="dateOnly"
        :timeOnly="timeOnly"
        :customFormat="customFormat"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DateTimeDisplay from '@/components/formItems/DateTimeDisplay.vue'
import TimeDatePicker from '@/components/formItems/TimeDatePicker.vue'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: 'datetime'
  },
  customFormat: {
    type: String,
    default: ''
  },
  dateOnly: {
    type: Boolean,
    default: false
  },
  timeOnly: {
    type: Boolean,
    default: false
  },
  showElapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>()

const isEditing = ref(false)
const tempValue = ref('')

const pickerMode = computed(() => {
  if (props.dateOnly) return 'date'
  if (props.timeOnly) return 'time'
  return 'datetime'
})

const startEdit = () => {
  if (props.editable && !props.disabled) {
    tempValue.value = props.modelValue
    isEditing.value = true
  }
}

const stopEdit = () => {
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  tempValue.value = ''
}

const handleUpdate = (value: string) => {
  emit('update:value', value)
}
</script>

<style scoped>
.cell-container {
  min-height: 1.5rem;
  width: 100%;
  position: relative;
}

.display-wrapper {
  padding: 0.125rem 0.25rem;
  cursor: pointer;
  min-height: 1.5rem;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--bg-light-subtle, #f8f9fa);
    border-radius: 0.25rem;
  }
}

.picker-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  background: var(--t-card-bg, #fff);
}

.picker-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding: 0 0.75rem 0.75rem;

  .btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;

    i {
      font-size: 0.875rem;
    }
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
  background: var(--t-card-bg, #fff);

  &:hover {
    background-color: var(--bg-light, #f8f9fa);
    color: var(--t-body-color, #495057);
  }
}
</style>
