<template>
  <span :class="classes" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  themeVariants,
  sizeVariants,
  type ThemeVariant,
  type SizeVariant,
} from '@/assets/themes/theme-config'

interface BadgeProps {
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
}

const props = defineProps<BadgeProps>()

const activeVariant = computed(() => {
  if (props.v) return props.v
  return themeVariants.find(variant => props[variant]) || 'primary'
})

const activeSize = computed(() => props.s || 'md')

const classes = computed(() => {
  const classList = ['badge']
  const prefix = props.outline ? 'badge-outline-' : 'badge-'
  classList.push(`${prefix}${activeVariant.value}`)
  classList.push(`badge-${activeSize.value}`)
  return classList
})
</script>
