<template>
  <div class="form-check" v-bind="$attrs">
    <input
      class="form-check-input"
      type="radio"
      :checked="modelValue === value"
      @change="handleChange"
      :id="id"
      :name="name"
    />
    <label v-if="label || $slots.default" class="form-check-label" :for="id">
      <slot>{{ label }}</slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface RadioProps {
  modelValue?: any
  value?: any
  label?: string
  name?: string
  id?: string
}

const props = defineProps<RadioProps>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const id = computed(
  () => props.id || `radio-${Math.random().toString(36).substr(2, 9)}`,
)

const handleChange = () => {
  emit('update:modelValue', props.value)
}
</script>
