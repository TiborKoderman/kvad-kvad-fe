<template>
  <select
    :class="['form-select', sizeClass]"
    :value="modelValue"
    @change="handleChange"
    v-bind="$attrs"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SizeVariant } from '@/assets/themes/theme-config'

interface SelectProps {
  modelValue?: string | number
  s?: SizeVariant
}

const props = withDefaults(defineProps<SelectProps>(), {
  s: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sizeClass = computed(() =>
  props.s !== 'md' ? `form-select-${props.s}` : '',
)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
