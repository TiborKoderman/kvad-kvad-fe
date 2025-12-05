<template>
  <textarea
    :class="['form-control', sizeClass]"
    :value="modelValue"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type SizeVariant } from '@/assets/themes/theme-config'

interface TextareaProps {
  modelValue?: string
  s?: SizeVariant
}

const props = withDefaults(defineProps<TextareaProps>(), {
  s: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sizeClass = computed(() =>
  props.s !== 'md' ? `form-control-${props.s}` : '',
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
