import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { applyThemeCssVars, getPreferredTheme } from '@/assets/themes/theme-config'
import type { ThemeMode } from '@/assets/themes/theme-config'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeMode>(getPreferredTheme())

  // Apply theme to document
  const applyTheme = (theme: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', theme)
    applyThemeCssVars(theme)
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
