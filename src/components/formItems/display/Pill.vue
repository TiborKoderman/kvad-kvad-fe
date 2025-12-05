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

interface PillProps {
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

const props = defineProps<PillProps>()

const activeVariant = computed(() => {
  if (props.v) return props.v
  return themeVariants.find(variant => props[variant]) || 'primary'
})

const activeSize = computed(() => props.s || 'md')

const classes = computed(() => {
  const classList = ['pill']
  const prefix = props.outline ? 'pill-outline-' : 'pill-'
  classList.push(`${prefix}${activeVariant.value}`)
  classList.push(`pill-${activeSize.value}`)
  return classList
})
</script>
