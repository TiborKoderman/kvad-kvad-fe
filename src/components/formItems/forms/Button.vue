<template>
  <button
    :class="classes"
    :disabled="disabled"
    @click.stop.prevent="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  themeVariants,
  sizeVariants,
  type ThemeVariant,
  type SizeVariant,
} from '@/assets/themes/theme-config'

interface ButtonProps {
  // Variant props (boolean flags)
  light?: boolean
  dark?: boolean
  primary?: boolean
  secondary?: boolean
  info?: boolean
  success?: boolean
  warning?: boolean
  danger?: boolean

  // Alternative: variant string prop
  v?: ThemeVariant

  // Size prop
  s?: SizeVariant

  // Other props
  disabled?: boolean
  outline?: boolean
}

const props = defineProps<ButtonProps>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Determine which variant is active (v prop takes precedence)
const activeVariant = computed(() => {
  if (props.v) return props.v
  return themeVariants.find(variant => props[variant]) || 'primary'
})

// Determine size (default to 'md')
const activeSize = computed(() => props.s || 'md')

// Compute button classes
const classes = computed(() => {
  const classList = ['btn']

  // Add variant class
  const prefix = props.outline ? 'btn-outline-' : 'btn-'
  classList.push(`${prefix}${activeVariant.value}`)

  // Add size class
  classList.push(`btn-${activeSize.value}`)

  return classList
})

// Handle click with disabled check
const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>
