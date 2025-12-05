# Theme System Documentation

## Overview

This project uses a centralized theme system with light and dark mode support.

## Single Source of Truth

Theme variants are defined in `/src/assets/themes/theme-config.ts`:

```typescript
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
```

## Theme Files

- **Light Theme**: `/src/assets/themes/light.scss`
- **Dark Theme**: `/src/assets/themes/dark.scss`
- **Config**: `/src/assets/themes/theme-config.ts`
- **Store**: `/src/stores/theme.ts`

## Usage

### Theme Toggle

The theme toggle button is located in the TopBar (top right, before user icon).
Click to switch between light and dark themes.

### Button Component

The Button component automatically uses theme variants:

```vue
<!-- Simple usage -->
<Button primary @click="handleClick">Click me</Button>
<Button success @click="save">Save</Button>
<Button danger @click="delete">Delete</Button>

<!-- With modifiers -->
<Button primary outline @click="action">Outline</Button>
<Button secondary size="lg" @click="action">Large</Button>
<Button info disabled @click="action">Disabled (won't trigger)</Button>
```

### Programmatic Theme Control

```typescript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Toggle theme
themeStore.toggleTheme()

// Set specific theme
themeStore.setTheme('dark')
themeStore.setTheme('light')

// Get current theme
console.log(themeStore.currentTheme) // 'light' or 'dark'
```

## How It Works

1. Theme is stored in localStorage and persists across sessions
2. System respects `prefers-color-scheme` media query on first load
3. CSS variables (`--bs-*`) update dynamically when theme changes
4. Smooth transitions between themes
5. All components using CSS variables automatically adapt

## Adding New Themes

1. Create new theme file in `/src/assets/themes/yourtheme.scss`
2. Define CSS variables under `[data-theme='yourtheme']`
3. Import in `app.scss`
4. Update `ThemeMode` type in `theme-config.ts`
5. Update theme store logic as needed
