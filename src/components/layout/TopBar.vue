<!-- TopBar.vue -->
<template>
  <div class="topbar navbar-expand-lg border-bottom">
    <button
      @click="menu.toggleCollapsed"
      class="btn topbar-btn text-decoration-none me-2"
      aria-label="Expand sidebar"
    >
      <i class="bi bi-layout-sidebar"></i>
    </button>
    <!-- Additional TopBar content -->
    <button
      @click="menu.toggleEditMode"
      :class="menu.editMode ? 'btn-primary' : 'topbar-btn'"
      class="btn text-decoration-none me-2"
      aria-label="Edit mode"
    >
      <i
        class="bi bi-pencil"
        :class="menu.editMode ? 'text-light' : ''"
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
</script>

<style scoped>
.topbar {
  height: 40px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  background-color: var(--t-chrome-bg);
  border-color: var(--t-chrome-border-color);
  color: var(--t-body-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.topbar-btn {
  background-color: transparent;
  border: 1px solid var(--t-border-color);
  color: var(--t-body-color);
}

.topbar-btn:hover {
  background-color: var(--bg-light-subtle);
}

.topbar-btn i {
  color: var(--t-body-color);
}
</style>
