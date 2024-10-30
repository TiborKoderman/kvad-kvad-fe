<!-- TopBar.vue -->
<template>
  <div class="navbar navbar-expand-lg border-bottom" :class="topbarClass">
    <div class="container-fluid">
      <button
        v-if="isCollapsed"
        @click="toggleCollapse"
        class="btn btn-link text-decoration-none me-2"
        aria-label="Expand sidebar"
      >
        <i class="bi bi-layout-sidebar text-black"></i>
      </button>
      <!-- Additional TopBar content -->
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  topbarClass: {
    type: String,
    default: 'bg-white',
  },
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-collapse'])

const toggleCollapse = () => {
  emit('toggle-collapse')
}
</script>

<style scoped>
.navbar {
  width: 100%;
}
</style>
