<template>
  <button
    @click="themeStore.toggleTheme()"
    class="btn btn-outline-light text-decoration-none me-2"
    :aria-label="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
    :title="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
  >
    <i
      class="bi"
      :class="themeStore.currentTheme === 'light' ? 'bi-moon-stars' : 'bi-sun'"
    ></i>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.1);
}
</style>
