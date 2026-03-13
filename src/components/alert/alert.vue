<template>
  <div>
    {{  }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  type: {
¸    default: 'info'
  },
  message: {
    type: String,
    required: true
  }
})

</script>

<style scoped>

</style>
