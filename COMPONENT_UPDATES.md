# Component System Updates - December 5, 2025

## ✅ Completed Changes

### 1. Theme System Updates

- ✅ Changed CSS variable prefix from `--bs-*` to `--t-*` (theme prefix)
- ✅ Added size variants: sm, md, lg, xl, xxl
- ✅ Updated light.scss and dark.scss with new prefix
- ✅ Fixed theme switching

### 2. Component Props Updates

All components now support:

- ✅ `:v="variant"` - Alternative to boolean props (e.g., `:v="'primary'"`)
- ✅ `:s="size"` - Size prop (sm, md, lg, xl, xxl)
- ✅ Boolean variant props still work (e.g., `primary`, `success`)
- ✅ Default variant is `primary` for all components
- ✅ All HTML attributes forwarded via `v-bind="$attrs"`

### 3. New Component Structure

Components reorganized into logical folders:

```
formItems/
├── display/
│   ├── Badge.vue (with :v, :s props)
│   └── Pill.vue (with :v, :s props)
├── feedback/
│   └── Alert.vue (with :v, :s, :icon props)
├── forms/
│   ├── Button.vue (with :v, :s props)
│   ├── Input.vue (with v-model, :s)
│   ├── Textarea.vue (with v-model, :s)
│   ├── Select.vue (with v-model, :s)
│   ├── Checkbox.vue (with v-model, label)
│   └── Radio.vue (with v-model, value, name)
└── layout/
    ├── Card.vue (with header/body/footer slots)
    └── Flex.vue (with col, fill, align, justify, wrap, gap)
```

### 4. New Components Created

- ✅ **Alert** - Now supports `:icon` prop for Bootstrap icons
- ✅ **Flex** - Layout component with flexbox utilities
- ✅ **Card** - Card component with slots
- ✅ **Input** - Form input with v-model
- ✅ **Textarea** - Textarea with v-model
- ✅ **Select** - Select dropdown with v-model
- ✅ **Checkbox** - Checkbox with v-model
- ✅ **Radio** - Radio button with v-model

### 5. SCSS Updates

- ✅ buttons.scss - Updated with all sizes and --t-\* variables
- ✅ badges.scss - Updated with all sizes and --t-\* variables
- ⏳ pills.scss - Needs size variants added
- ⏳ alerts.scss - Needs size variants added
- ⏳ cards.scss - Needs to be created
- ⏳ flex.scss - Uses Bootstrap utilities

## 📝 Usage Examples

### Button with new props:

```vue
<!-- Using :v prop -->
<Button :v="'primary'" :s="'lg'" @click="action">Click me</Button>

<!-- Using boolean props (still works) -->
<Button primary s="sm" @click="action">Small Button</Button>

<!-- Mix and match -->
<Button :v="computedVariant" :s="size" outline>Dynamic</Button>
```

### Alert with icon:

```vue
<Alert success icon="check-circle" :s="'lg'">
  Success! Operation completed.
</Alert>

<Alert danger icon="exclamation-triangle" :v="'danger'">
  Error occurred!
</Alert>
```

### Flex layout:

```vue
<Flex justify="between" align="center" gap="3">
  <div>Left content</div>
  <div>Right content</div>
</Flex>

<Flex col fill gap="2">
  <Card primary>Card 1</Card>
  <Card secondary>Card 2</Card>
</Flex>
```

### Form components:

```vue
<Input v-model="name" placeholder="Enter name" :s="'lg'" />
<Textarea v-model="description" rows="4" />
<Select v-model="selected" :s="'sm'">
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
<Checkbox v-model="agreed" label="I agree" />
<Radio v-model="choice" value="a" label="Option A" name="choice" />
```

### Card:

```vue
<Card primary>
  <template #header>Card Header</template>
  Card body content here
  <template #footer>Card Footer</template>
</Card>
```

## 🔄 Migration from Old Components

Old components in `/formItems/` root still exist for backwards compatibility.
New components are in organized folders.

To migrate:

1. Update imports from old locations to new folders
2. Add `:s="'md'"` if you want explicit size (md is default)
3. Optionally use `:v="variant"` instead of boolean props
4. Update CSS variable references from `--bs-*` to `--t-*` if custom styling

## ⚠️ Remaining Tasks

1. Complete SCSS updates for pills, alerts with all sizes
2. Create cards.scss styling
3. Update ComponentsView to show new components
4. Test theme switching thoroughly
5. Remove old component files after migration
6. Update documentation

## 🎨 Theme Variables

New CSS variables (--t-\* prefix):

- `--t-primary`, `--t-secondary`, `--t-info`, `--t-success`, `--t-warning`, `--t-danger`
- `--t-light`, `--t-dark`
- `--t-body-bg`, `--t-body-color`
- `--t-border-color`
- `--t-input-bg`, `--t-input-color`, `--t-input-border-color`
- `--t-link-color`, `--t-link-hover-color`

## 🔧 ESLint Config

Updated to allow single-word names for all new components.
