<template>
  <div :class="classes" role="alert" v-bind="$attrs">
    <i v-if="icon" :class="`bi bi-${icon} me-2`"></i>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  themeVariants,
  sizeVariants,
  type ThemeVariant,
  type SizeVariant,
} from '@/assets/themes/theme-config'

interface AlertProps {
  light?: boolean
  dark?: boolean
  primary?: boolean
  secondary?: boolean
  info?: boolean
  success?: boolean
  warning?: boolean
  danger?: boolean
  v?: ThemeVariant
  s?: SizeVariant
  outline?: boolean
  icon?: string
}

const props = defineProps<AlertProps>()

const activeVariant = computed(() => {
  if (props.v) return props.v
  return themeVariants.find(variant => props[variant]) || 'primary'
})

const activeSize = computed(() => props.s || 'md')

const classes = computed(() => {
  const classList = ['alert']
  const prefix = props.outline ? 'alert-outline-' : 'alert-'
  classList.push(`${prefix}${activeVariant.value}`)
  classList.push(`alert-${activeSize.value}`)
  return classList
})
</script>
