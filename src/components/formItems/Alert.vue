<template>
  <div :class="alertClasses" role="alert" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeVariants } from '@/assets/themes/theme-config'

// Explicit props from theme variants (single source of truth)
interface AlertProps {
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

const props = defineProps<AlertProps>()

// Determine which variant is active
const activeVariant = computed(() => {
  return themeVariants.find(v => props[v]) || 'primary'
})

// Compute alert classes
const alertClasses = computed(() => {
  const classes = ['alert']

  // Add variant class
  const prefix = props.outline ? 'alert-outline-' : 'alert-'
  classes.push(`${prefix}${activeVariant.value}`)

  return classes
})
</script>

<style scoped>
/* Styles handled in alerts.scss */
</style>
