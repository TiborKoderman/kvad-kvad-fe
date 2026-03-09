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

export const baseThemeColors = {
  light: {
    neutral: '#f6eeff',
    text: '#370748',
    primary: '#b00b69',
    secondary: '#f52b2b',
    info: '#f37e10',
    success: '#07ab77',
    warning: '#d6d206',
    danger: '#e44102',
  },
  dark: {
    neutral: '#1a1a1a',
    text: '#e0e0e0',
    primary: '#d63384',
    secondary: '#fd7e14',
    info: '#0dcaf0',
    success: '#198754',
    warning: '#ffc107',
    danger: '#dc3545',
  },
} as const

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  const value = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized

  const int = parseInt(value, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const mix = (colorA: string, colorB: string, weight: number) => {
  const w = clamp(weight, 0, 1)
  const a = hexToRgb(colorA)
  const b = hexToRgb(colorB)
  return rgbToHex(
    Math.round(a.r * (1 - w) + b.r * w),
    Math.round(a.g * (1 - w) + b.g * w),
    Math.round(a.b * (1 - w) + b.b * w),
  )
}

const tint = (color: string, amount: number) => mix(color, '#ffffff', amount)
const shade = (color: string, amount: number) => mix(color, '#000000', amount)

const luminance = (hex: string) => {
  const { r, g, b } = hexToRgb(hex)
  const channel = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  }

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

const pickTextColor = (background: string, darkText: string, lightText: string) => {
  return luminance(background) > 0.5 ? darkText : lightText
}

export const createThemeCssVars = (theme: ThemeMode) => {
  const base = baseThemeColors[theme]
  const isDark = theme === 'dark'

  const textLight = isDark ? base.text : '#ffffff'
  const textDark = isDark ? shade(base.neutral, 0.85) : base.text

  const bgLight = tint(base.neutral, isDark ? 0.12 : 0.04)
  const bgLightSubtle = tint(base.neutral, isDark ? 0.2 : 0.1)
  const bgDark = isDark ? shade(base.neutral, 0.22) : shade(base.text, 0.2)
  const bgDarkSubtle = isDark ? shade(base.neutral, 0.12) : shade(base.text, 0.1)

  const surfaceBg = isDark ? tint(base.neutral, 0.08) : bgLight
  const chromeBg = isDark ? shade(base.neutral, 0.06) : tint(base.neutral, 0.02)

  const borderColor = mix(base.neutral, base.text, isDark ? 0.28 : 0.2)
  const tableBorderColor = mix(base.neutral, base.text, isDark ? 0.14 : 0.2)
  const cardBg = isDark ? tint(base.neutral, 0.05) : tint(base.neutral, 0.12)
  const cardBorderColor = mix(cardBg, borderColor, 0.5)
  const inputBg = isDark ? tint(base.neutral, 0.03) : cardBg
  const inputBorderColor = mix(inputBg, borderColor, 0.6)

  const tableBodyBg = isDark ? tint(surfaceBg, 0.03) : surfaceBg
  const tableBodyStripedBg = isDark ? tint(surfaceBg, 0.08) : tint(surfaceBg, 0.03)
  const tableHoverBg = isDark ? tint(surfaceBg, 0.12) : tint(surfaceBg, 0.08)
  const tableHoverStripedBg = isDark ? tint(surfaceBg, 0.16) : tint(surfaceBg, 0.12)

  const tooltipBg = isDark ? shade(base.neutral, 0.08) : shade(base.text, 0.12)
  const tooltipColor = pickTextColor(tooltipBg, textDark, textLight)

  const txtLight = pickTextColor(bgLight, textDark, textLight)
  const txtDark = pickTextColor(bgDark, textDark, textLight)

  const linkColor = base.text
  const linkHoverColor = isDark ? tint(base.text, 0.15) : shade(base.text, 0.15)

  return {
    '--t-light': bgLight,
    '--t-dark': base.text,
    '--t-primary': base.primary,
    '--t-secondary': base.secondary,
    '--t-info': base.info,
    '--t-success': base.success,
    '--t-warning': base.warning,
    '--t-danger': base.danger,

    '--bg-light': bgLight,
    '--bg-light-subtle': bgLightSubtle,
    '--bg-dark': bgDark,
    '--bg-dark-subtle': bgDarkSubtle,
    '--bg-primary': base.primary,
    '--bg-secondary': base.secondary,
    '--bg-info': base.info,
    '--bg-success': base.success,
    '--bg-warning': base.warning,
    '--bg-danger': base.danger,

    '--txt-light': txtLight,
    '--txt-dark': txtDark,
    '--txt-primary': pickTextColor(base.primary, textDark, textLight),
    '--txt-secondary': pickTextColor(base.secondary, textDark, textLight),
    '--txt-info': pickTextColor(base.info, textDark, textLight),
    '--txt-success': pickTextColor(base.success, textDark, textLight),
    '--txt-warning': pickTextColor(base.warning, textDark, textLight),
    '--txt-danger': pickTextColor(base.danger, textDark, textLight),

    '--t-body-bg': surfaceBg,
    '--t-body-color': base.text,

    '--t-chrome-bg': chromeBg,
    '--t-chrome-border-color': borderColor,

    '--t-border-color': borderColor,
    '--t-table-border-color': tableBorderColor,
    '--t-card-bg': cardBg,
    '--t-card-border-color': cardBorderColor,
    '--t-input-bg': inputBg,
    '--t-input-border-color': inputBorderColor,
    '--t-input-color': base.text,

    '--t-table-body-bg': tableBodyBg,
    '--t-table-body-striped-bg': tableBodyStripedBg,
    '--t-table-hover-bg': tableHoverBg,
    '--t-table-hover-striped-bg': tableHoverStripedBg,

    '--t-tooltip-bg': tooltipBg,
    '--t-tooltip-color': tooltipColor,

    '--t-link-color': linkColor,
    '--t-link-hover-color': linkHoverColor,
  }
}

export const applyThemeCssVars = (theme: ThemeMode, target?: HTMLElement) => {
  const element = target ?? document.documentElement
  const vars = createThemeCssVars(theme)

  Object.entries(vars).forEach(([key, value]) => {
    element.style.setProperty(key, value)
  })
}

export const getPreferredTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}
