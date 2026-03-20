# Modal Helper Usage Examples

The Modal helper opens Vue components directly, without registering them in a modal store. It supports:

- direct `Modal.open(Component, title, props, model, actions)` calls
- optional `v-model` passthrough
- auto-generated save buttons when the modal exposes or registers a submit-like handler
- internal modal hooks via `useModal()`

## Basic Usage

### 1. Simple Modal with Auto-Detection

```typescript
import { Modal } from '@/components/utils/modal'
import MyFormComponent from './MyFormComponent.vue'

// Positional signature
const result = await Modal.open(MyFormComponent, 'Edit User', {
  userId: 123,
})

console.log('Modal returned:', result)
```

### 2. Confirmation Modal

```typescript
import { Modal } from '@/components/utils/modal'
import ConfirmDeleteComponent from './ConfirmDeleteComponent.vue'

const confirmed = await Modal.confirm(ConfirmDeleteComponent, {
  title: 'Confirm Deletion',
  props: {
    itemName: 'User Account',
  },
})

if (confirmed) {
  // User confirmed
}
```

### 3. Info Modal

```typescript
import { Modal } from '@/components/utils/modal'
import InfoComponent from './InfoComponent.vue'

await Modal.info(InfoComponent, {
  title: 'Information',
  props: {
    message: 'Operation completed successfully',
  },
})
```

### 4. Custom Buttons

```typescript
import { Modal } from '@/components/utils/modal'
import CustomComponent from './CustomComponent.vue'

const result = await Modal.open(CustomComponent, {
  title: 'Custom Actions',
  props: { data: someData },
  actions: {
    saveDraft: {
      label: 'Save Draft',
      closeOnSuccess: false,
      handler: async ({ modal }) => {
        if (modal && typeof modal.saveDraft === 'function') {
          return modal.saveDraft()
        }
      },
    },
    publish: {
      label: 'Publish',
      variant: 'success',
      outline: false,
      handler: async ({ modal }) => {
        if (modal && typeof modal.publish === 'function') {
          return modal.publish()
        }
      },
    },
  },
})
```

### 5. Delete Confirmation Modal

```typescript
import { Modal } from '@/components/utils/modal'
import DeleteConfirmComponent from './DeleteConfirmComponent.vue'

const confirmed = await Modal.open(DeleteConfirmComponent, {
  title: 'Delete Item',
  props: {
    itemId: 456,
  },
  actions: {
    delete: {
      label: 'Delete',
      variant: 'danger',
      outline: false,
      handler: () => true,
    },
  },
})
```

## Component Requirements

### For Auto-Submit Detection

You can either expose a submit-like method, or register the handler from inside with `useModal()`.

#### Option A: `useModal()`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useModal } from '@/components/utils/modal'

const modal = useModal()
const formData = ref({ name: '', email: '' })

async function submit() {
  if (!formData.value.name) {
    throw new Error('Name is required')
  }

  return formData.value
}

modal.onSubmit(() => submit())
</script>
```

#### Option B: `defineExpose()`

```vue
<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({ name: '', email: '' })

async function submit() {
  if (!formData.value.name) {
    throw new Error('Name is required')
  }

  return formData.value
}

defineExpose({ submit })
</script>
```

### For Custom Actions

Expose or register any methods you want to call from action buttons:

```vue
<script setup lang="ts">
async function saveDraft() {
  // Save draft logic
  return { saved: true, draft: true }
}

async function publish() {
  // Publish logic
  return { saved: true, published: true }
}

defineExpose({ saveDraft, publish })
</script>
```

## Modal Options

```typescript
interface ModalOptions {
  title?: string
  props?: Record<string, unknown>
  model?: Ref<unknown>
  actions?: ModalActions
  fullscreen?: boolean
  closeOnBackdrop?: boolean
}

interface ModalActionConfig {
  handler?: ({ modal, model, props }) => unknown | Promise<unknown>
  label?: string
  variant?: ThemeVariant
  outline?: boolean
  closeOnSuccess?: boolean
}
```

## Integration with Existing Code

This modal helper works alongside your existing modal store. You can use it directly without registering components:

```typescript
// Old way (requires pre-registration)
import { useModalStore } from '@/stores/modals'
const modalStore = useModalStore()
await modalStore.open('AddUserModal', { editUser: user })

// New way (direct component import)
import { Modal } from '@/components/utils/modal'
import AddUserModal from '@/components/modals/AddUserModal.vue'
await Modal.open(AddUserModal, {
  title: 'Add User',
  props: { editUser: user },
})
```
