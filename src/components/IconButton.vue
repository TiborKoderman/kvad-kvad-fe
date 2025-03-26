<template>
  <i :class="`bi bi-${props.icon}`"></i>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'var(--bs-dark)',
  },
  hcolor: {
    type: String,
    default: 'var(--bs-primary)',
  },
})
</script>

<style scoped>
i {
  color: v-bind(color);
}

i:hover {
  cursor: pointer;
  color: v-bind(hcolor);
}
</style>
