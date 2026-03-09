<template>
  <div
    @click="themeStore.toggleTheme()"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    class="theme-toggle"
    :aria-label="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
    :title="`Switch to ${themeStore.currentTheme === 'light' ? 'dark' : 'light'} theme`"
  >
    <div
      class="icon-stack"
      :class="{ 'is-light': displayedTheme === 'light', 'is-hovered': isHovered }"
    >
      <MdiIcon class="icon icon-sun" :d="mdiWeatherSunny" />
      <MdiIcon class="icon icon-moon" :d="mdiWeatherNight" />
    </div>
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

.icon-stack {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  overflow: hidden;
}

.icon {
  position: absolute;
  inset: 0;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease,
    color 0.3s ease;
}

.icon :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
  color: currentColor;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.theme-toggle:hover :deep(svg) {
  color: var(--t-primary) !important;
}

.icon-stack.is-light .icon-sun {
  transform: translateY(0);
  opacity: 1;
}

.icon-stack.is-light .icon-moon {
  transform: translateY(100%);
  opacity: 0;
}

.icon-stack:not(.is-light) .icon-sun {
  transform: translateY(100%);
  opacity: 0;
}

.icon-stack:not(.is-light) .icon-moon {
  transform: translateY(0);
  opacity: 1;
}

.icon-stack.is-hovered.is-light .icon-sun {
  transform: translateY(100%);
  opacity: 0;
}

.icon-stack.is-hovered.is-light .icon-moon {
  transform: translateY(0);
  opacity: 1;
}

.icon-stack.is-hovered:not(.is-light) .icon-moon {
  transform: translateY(100%);
  opacity: 0;
}

.icon-stack.is-hovered:not(.is-light) .icon-sun {
  transform: translateY(0);
  opacity: 1;
}
</style>
