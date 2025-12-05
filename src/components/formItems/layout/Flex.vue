<template>
  <div :class="classes" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FlexProps {
  col?: boolean
  fill?: boolean
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  gap?: string | number
}

const props = defineProps<FlexProps>()

const classes = computed(() => {
  const classList = ['d-flex']

  if (props.col) classList.push('flex-column')
  if (props.fill) classList.push('flex-fill')
  if (props.wrap) classList.push('flex-wrap')

  if (props.align) {
    classList.push(`align-items-${props.align}`)
  }

  if (props.justify) {
    classList.push(`justify-content-${props.justify}`)
  }

  if (props.gap) {
    const gapValue =
      typeof props.gap === 'number' ? `gap-${props.gap}` : props.gap
    classList.push(gapValue)
  }

  return classList
})
</script>

<style scoped>
/* Flex styles handled by Bootstrap/custom utilities */
</style>
