<template>
  <svg v-bind="$attrs" :viewBox="props.viewBox" :style="style">
    <path :d="props.d" />
    <path
      v-for="(additionalPath, index) in props.additionalPaths"
      :key="`additional-${index}`"
      :d="String(additionalPath)"
    />
  </svg>
</template>


<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  d: {
    type: String,
    required: true
  },
  style: {
    type: Object,
    default: () => ({})
  },

  viewBox: {
    type: String,
    default: '0 0 24 24'
  },
  flip: {
    type: String,
    validator: (value: string) => ['horizontal', 'vertical', 'both', 'none'].includes(value),
    default: 'none'
  },
  rotate: {
    type: Number,
    default: 0
  },
    additionalPaths: {
    type: Array,
    /**
     * Validator function for additionalPaths property
     * Validates that all items in the array are strings (SVG path data)
     * @param value - The array of additional paths to validate
     * @returns True if all items are strings
     */
    validator: (value) => Array.isArray(value) && value.every((path) => typeof path === 'string'),
    default: () => []
  }

})




</script>

<style scoped>
svg {
  transform: rotate(var(--r, 0deg)) scale(var(--sx, 1), var(--sy, 1));
}

path {
  fill: currentColor;
}
</style>
