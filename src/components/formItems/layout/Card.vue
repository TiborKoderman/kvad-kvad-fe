<template>
  <div :class="classes" v-bind="$attrs">
    <slot name="header" v-if="$slots.header">
      <div class="card-header">
        <slot name="header" />
      </div>
    </slot>

    <div class="card-body">
      <slot />
    </div>

    <slot name="footer" v-if="$slots.footer">
      <div class="card-footer">
        <slot name="footer" />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeVariants, type ThemeVariant } from '@/assets/themes/theme-config'

interface CardProps {
  light?: boolean
  dark?: boolean
  primary?: boolean
  secondary?: boolean
  info?: boolean
  success?: boolean
  warning?: boolean
  danger?: boolean
  v?: ThemeVariant
  outline?: boolean
}

const props = defineProps<CardProps>()

const activeVariant = computed(() => {
  if (props.v) return props.v
  return themeVariants.find(variant => props[variant]) || undefined
})

const classes = computed(() => {
  const classList = ['card']

  if (activeVariant.value) {
    const prefix = props.outline ? 'card-outline-' : 'card-'
    classList.push(`${prefix}${activeVariant.value}`)
  }

  return classList
})
</script>
