# Component Library Documentation

## Overview

This directory contains reusable form components built with a consistent API and theme system.

## Design Philosophy

- **Single source of truth**: Theme variants defined in `/src/assets/themes/theme-config.ts`
- **Boolean props**: Use `primary`, `success`, etc. as boolean flags instead of `variant="primary"`
- **HTML attribute forwarding**: All components forward native HTML attributes via `v-bind="$attrs"`
- **Outline support**: All components support `outline` prop for outlined variants
- **ESLint exceptions**: Single-word component names are allowed for these base components

## Components

### Button

Custom button component with full HTML button support.

**Props:**

- Theme variants: `light`, `dark`, `primary`, `secondary`, `info`, `success`, `warning`, `danger` (boolean)
- `outline` (boolean): Renders outline variant
- `size` ('sm' | 'lg'): Button size
- `disabled` (boolean): Disables button and prevents click events
- All native button attributes supported

**Usage:**

```vue
<Button primary @click="handleClick">Click me</Button>
<Button success outline size="lg" @click="save">Save</Button>
<Button danger disabled @click="delete">Disabled</Button>
<Button info title="Tooltip text" data-test-id="btn-1">With attrs</Button>
```

**Events:**

- `@click`: Emitted when button is clicked (not emitted when disabled)

---

### Badge

Inline badge/label component.

**Props:**

- Theme variants: `light`, `dark`, `primary`, `secondary`, `info`, `success`, `warning`, `danger` (boolean)
- `outline` (boolean): Renders outline variant
- All native span attributes supported

**Usage:**

```vue
<Badge primary>New</Badge>
<Badge danger outline>Error</Badge>
<Badge success title="Status badge">Active</Badge>

<h4>Messages <Badge primary>4</Badge></h4>
```

---

### Pill

Rounded pill/tag component (similar to badge but with full border radius).

**Props:**

- Theme variants: `light`, `dark`, `primary`, `secondary`, `info`, `success`, `warning`, `danger` (boolean)
- `outline` (boolean): Renders outline variant
- All native span attributes supported

**Usage:**

```vue
<Pill primary>JavaScript</Pill>
<Pill secondary outline>TypeScript</Pill>
<Pill success data-tag-id="tag-1">Active</Pill>
```

---

### Alert

Alert/notification block component.

**Props:**

- Theme variants: `light`, `dark`, `primary`, `secondary`, `info`, `success`, `warning`, `danger` (boolean)
- `outline` (boolean): Renders outline variant
- All native div attributes supported

**Usage:**

```vue
<Alert success>
  <strong>Success!</strong> Your action completed successfully.
</Alert>

<Alert danger outline role="alert" aria-live="polite">
  <h4>Error</h4>
  <p>Something went wrong. Please try again.</p>
</Alert>
```

---

## Testing

Visit `/components` route to see all component variants in action with an interactive demo.

## Styling

Component styles are in `/src/assets/scss/`:

- `buttons.scss` - Button styles
- `badges.scss` - Badge styles
- `pills.scss` - Pill styles
- `alerts.scss` - Alert styles

All styles use CSS variables for theming and are independent of Bootstrap.

## Future Components

- Toast notifications (dynamic/dismissible alerts)
- Alert with close button
- More form components as needed
