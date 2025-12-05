import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode } from '@/assets/themes/theme-config'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>('light')

  // Load theme from localStorage on init
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null
  if (savedTheme) {
    currentTheme.value = savedTheme
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    currentTheme.value = 'dark'
  }

  // Apply theme to document
  const applyTheme = (theme: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Initialize theme
  applyTheme(currentTheme.value)

  // Watch for theme changes
  watch(currentTheme, newTheme => {
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  })

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (theme: ThemeMode) => {
    currentTheme.value = theme
  }

  return {
    currentTheme,
    toggleTheme,
    setTheme,
  }
})
