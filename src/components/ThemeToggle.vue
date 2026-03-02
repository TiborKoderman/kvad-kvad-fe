<template>
  <div
    @click="themeStore.toggleTheme()"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="theme-toggle"
    :aria-label="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
    :title="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
  >
    <MdiIcon
      :d="getIconPath()"
      :style="{ width: '1.5rem', height: '1.5rem' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import MdiIcon from './MdiIcon.vue'
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js'

const themeStore = useThemeStore()
const isHovered = ref(false)
const displayedTheme = ref(themeStore.currentTheme)

// Delay the icon change to sync with theme transition
watch(() => themeStore.currentTheme, (newTheme) => {
  setTimeout(() => {
    displayedTheme.value = newTheme
  }, 300)
})

const getIconPath = () => {
  const isLight = displayedTheme.value === 'light'

  if (isHovered.value) {
    return isLight ? mdiWeatherNight : mdiWeatherSunny
  }

  return isLight ? mdiWeatherSunny : mdiWeatherNight
}
</script>

<style scoped>
.theme-toggle {
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.theme-toggle :deep(svg) {
  color: currentColor;
  transition: color 0.3s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle:hover :deep(svg) {
  color: var(--t-primary) !important;
}
</style>
