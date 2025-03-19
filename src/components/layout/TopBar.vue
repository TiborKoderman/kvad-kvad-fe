<!-- TopBar.vue -->
<template>
  <div class="topbar navbar-expand-lg border-bottom" :class="topbarClass">
      <button
        @click="toggleCollapse"
        class="btn btn-link text-decoration-none me-2"
        aria-label="Expand sidebar"
      >
        <i class="bi bi-layout-sidebar text-black"></i>
      </button>
      <!-- Additional TopBar content -->
      <UserIcon />
  </div>
</template>

<script setup lang="ts">
import UserIcon from '@/components/UserIcon.vue'
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
.topbar {
  height: 80px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
