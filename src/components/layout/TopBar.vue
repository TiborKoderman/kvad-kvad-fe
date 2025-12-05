<!-- TopBar.vue -->
<template>
  <div class="topbar navbar-expand-lg border-bottom" :class="topbarClass">
    <button
      @click="menu.toggleCollapsed"
      class="btn btn-outline-light text-decoration-none me-2"
      aria-label="Expand sidebar"
    >
      <i class="bi bi-layout-sidebar text-black"></i>
    </button>
    <!-- Additional TopBar content -->
    <button
      @click="menu.toggleEditMode"
      :class="menu.editMode ? 'btn-primary' : 'btn-outline-light'"
      class="btn text-decoration-none me-2"
      aria-label="Edit mode"
    >
      <i
        class="bi bi-pencil"
        :class="menu.editMode ? 'text-light' : 'text-dark'"
      ></i>
    </button>

    <ThemeToggle class="ms-auto" />
    <UserIcon />
  </div>
</template>

<script setup lang="ts">
import UserIcon from '@/components/UserIcon.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import useMenuStore from '@/stores/menu'

const menu = useMenuStore()

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
</script>

<style scoped>
.topbar {
  height: 80px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
}
</style>
