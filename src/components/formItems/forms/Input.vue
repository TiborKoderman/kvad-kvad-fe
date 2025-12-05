<template>
  <input
    :class="['form-control', sizeClass]"
    :type="type"
    :value="modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SizeVariant } from '@/assets/themes/theme-config'

interface InputProps {
  modelValue?: string | number
  type?: string
  s?: SizeVariant
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  s: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sizeClass = computed(() =>
  props.s !== 'md' ? `form-control-${props.s}` : '',
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
