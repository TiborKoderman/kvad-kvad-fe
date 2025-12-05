// Single source of truth for theme variants
export const themeVariants = [
  'light',
  'dark',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
] as const

export type ThemeVariant = (typeof themeVariants)[number]

// Size variants
export const sizeVariants = ['sm', 'md', 'lg', 'xl', 'xxl'] as const

export type SizeVariant = (typeof sizeVariants)[number]

export type ThemeMode = 'light' | 'dark'
