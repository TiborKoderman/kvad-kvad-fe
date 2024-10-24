<!-- TopBar.vue -->
<template>
    <nav
      class="navbar navbar-expand-lg"
      :class="topbarClass"
    >
      <div class="container-fluid">
        <button
          v-if="isCollapsed"
          @click="toggleCollapse"
          class="btn btn-link text-decoration-none me-2"
          aria-label="Expand sidebar"
        >
          <i class="bi bi-list"></i>
        </button>
        <!-- Additional TopBar content -->
      </div>
    </nav>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    topbarClass: {
      type: String,
      default: 'bg-light',
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['toggle-collapse']);
  
  const toggleCollapse = () => {
    emit('toggle-collapse');
  };
  </script>
  
  <style scoped>
  .navbar {
    width: 100%;
  }
  </style>
  