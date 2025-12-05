<template>
  <div class="form-check" v-bind="$attrs">
    <input
      class="form-check-input"
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
      :id="id"
    />
    <label v-if="label || $slots.default" class="form-check-label" :for="id">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CheckboxProps {
  modelValue?: boolean
  label?: string
  id?: string
}

const props = defineProps<CheckboxProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const id = computed(
  () => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`,
)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
