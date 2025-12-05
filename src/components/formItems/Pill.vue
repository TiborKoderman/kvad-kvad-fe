<template>
  <span :class="pillClasses" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeVariants } from '@/assets/themes/theme-config'

// Explicit props from theme variants (single source of truth)
interface PillProps {
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

const props = defineProps<PillProps>()

// Determine which variant is active
const activeVariant = computed(() => {
  return themeVariants.find(v => props[v]) || 'primary'
})

// Compute pill classes
const pillClasses = computed(() => {
  const classes = ['pill']

  // Add variant class
  const prefix = props.outline ? 'pill-outline-' : 'pill-'
  classes.push(`${prefix}${activeVariant.value}`)

  return classes
})
</script>

<style scoped>
/* Styles handled in pills.scss */
</style>
