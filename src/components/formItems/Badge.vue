<template>
  <span :class="badgeClasses" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeVariants } from '@/assets/themes/theme-config'

// Explicit props from theme variants (single source of truth)
interface BadgeProps {
  light?: boolean
  dark?: boolean
  primary?: boolean
  secondary?: boolean
  info?: boolean
  success?: boolean
  warning?: boolean
  danger?: boolean
  outline?: boolean
}

const props = defineProps<BadgeProps>()

// Determine which variant is active
const activeVariant = computed(() => {
  return themeVariants.find(v => props[v]) || 'primary'
})

// Compute badge classes
const badgeClasses = computed(() => {
  const classes = ['badge']

  // Add variant class
  const prefix = props.outline ? 'badge-outline-' : 'badge-'
  classes.push(`${prefix}${activeVariant.value}`)

  return classes
})
</script>

<style scoped>
/* Styles handled in badges.scss */
</style>
